import { defineStore } from 'pinia'
import { computed, watch, ref } from "vue"
import getDocument from "@/composables/getDocument";
import getCollection from "@/composables/getCollectionAsDictionary";
import useDocument from "@/composables/useDocument";
import { useMachine } from "@xstate/vue";
import { NashraMachine } from "@/composables/NashraMachine";

export const useNashraStore = defineStore('Nashra', () => {
    console.log("from pinia before use machine");
    const ENV = "prod";
    const WiNNING_SCORE = 152;
    const { doc: board, getDoc } = getDocument("board");
    const { documents: players } = getCollection("players");
    const { documents: sponcers } = getCollection("sponcers");
    const { updateDoc } = useDocument("board");
    const { send, state } = useMachine(NashraMachine);
    const IsDataProvided = computed(() => board.value && players.value && sponcers.value && !board.value.hide)
    console.log("from pinia after use machine");

    const matchData = computed(() => {
        if (!IsDataProvided.value) return null;
        let names = { team1: "", team2: "" }
        if (board.value.namesControl === "auto") {
            names = {
                team1: board.value.team1.top && board.value.team1.bottom ? `${players.value[board.value.team1.top].name} | ${players.value[board.value.team1.bottom].name}` : "لنا",
                team2: board.value.team2.left && board.value.team2.right ? `${players.value[board.value.team2.right].name} | ${players.value[board.value.team2.left].name}` : "لهم"
            };
        } else {
            names = {
                team1: board.value.team1.manualName,
                team2: board.value.team2.manualName,
            };
        }
        let team1TotalScore = board.value.team1.scores.reduce((s1, s2) => s1 + s2, 0);
        let team2TotalScore = board.value.team2.scores.reduce((s1, s2) => s1 + s2, 0);
        let winner = team1TotalScore >= WiNNING_SCORE || team2TotalScore >= WiNNING_SCORE && (team1TotalScore !== team2TotalScore)
            ? team1TotalScore > team2TotalScore ? "team1" : "team2"
            : null;
        let team1Scores = board.value.team1.scores.reverse();
        if (team1Scores.length > 15)
            team1Scores.push(team1Scores.splice(14).reduce((acc, s) => acc + s, 0));
        let team2Scores = board.value.team2.scores.reverse();
        if (team1Scores.length > 15)
            team2Scores.push(team2Scores.splice(14).reduce((acc, s) => acc + s, 0));

        return {
            team1: {
                name: names.team1,
                scores: team1Scores,
                totalScore: team1TotalScore,
                sponsorLogo: sponcers.value[board.value.team1.sponcer],
            },
            team2: {
                name: names.team2,
                scores: team2Scores,
                totalScore: team2TotalScore,
                sponsorLogo: sponcers.value[board.value.team2.sponcer],
            },
            winner
        }
    })

    watch(
        matchData,
        (newVal, oldVal) => {
            if (
                oldVal !== null
                &&
                (newVal.team1.totalScore > oldVal.team1.totalScore || newVal.team2.totalScore > oldVal.team2.totalScore)
            ) {
                console.log("detect increase in scores so trigger the SCORE_INCREASED signal");
                SendScoreIncreasedSignal();
            }
        }
    );


    const startDataFetching = async () => {
        await getDoc(ENV);
    }

    const SendScoreIncreasedSignal = () => {
        send("SCORE_INCREASED", {
            startAnimate: async () => {
                await updateDoc(ENV, { animationRunning: true });
            }
        });
    }
    
    const SendAnimationEndedSignal = () => {
        send("ANIMATION_ENDED", {
            endAnimate: async () => {
                await updateDoc(ENV, { animationRunning: false });
            },
            winner: matchData.value.winner
        })
    }

    return { IsDataProvided, currentStateNames: computed(() => state.value.toStrings()), startDataFetching, matchData, SendAnimationEndedSignal };
}) 