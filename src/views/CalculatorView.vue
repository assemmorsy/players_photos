<template>
  <div
    v-if="board && players && sponcers && !board.hide"
    class="position-relative text-center h-100 w-100"
  >
    <component
      :is="COMPS[stateMachine.value].comp"
      v-bind="COMPS[stateMachine.value].props"
    ></component>
  </div>
</template>

<script setup>
import { computed, watch, ref, onBeforeMount } from "vue";
import { useMachine } from "@xstate/vue";

import { showMachine } from "@/composables/showMachine";

import Score from "@/components/calculator/Score.vue";
import DetailedScore from "@/components/calculator/DetailedScore.vue";
import WinnerView from "@/components/calculator/WinnerView.vue";
import useDocument from "@/composables/useDocument";
import getDocument from "@/composables/getDocument";
import getCollection from "@/composables/getCollectionAsDictionary";

const {
  error: updatingError,
  isPending: loadingUpdates,
  updateDoc,
} = useDocument("board");
const { error: boardError, doc: board, getDoc } = getDocument("board");
const { error: loadingPlayersError, documents: players } =
  getCollection("players");

const { error: loadingSponcersError, documents: sponcers } =
  getCollection("sponcers");

const ENV = "prod";
const WiNNING_SCORE = 152;

onBeforeMount(async () => {
  await getDoc(ENV);
});

const total = computed(() => {
  if (board.value) {
    let team1 = board.value.team1.scores.reduce((s1, s2) => s1 + s2, 0);
    let team2 = board.value.team2.scores.reduce((s1, s2) => s1 + s2, 0);
    return { team1, team2 };
  } else {
    return null;
  }
});

const teamsNames = computed(() => {
  if (board.value && players.value) {
    if (board.value.namesControl === "auto") {
      let names = {};
      if (board.value.team1.top && board.value.team1.bottom) {
        names.team1 = `${players.value[board.value.team1.top].name} | ${
          players.value[board.value.team1.bottom].name
        }`;
      } else if (!board.value.team1.top && board.value.team1.bottom) {
        names.team1 = `${players.value[board.value.team1.bottom].name}`;
      } else if (board.value.team1.top && !board.value.team1.bottom) {
        names.team1 = `${players.value[board.value.team1.top].name}`;
      } else if (!board.value.team1.top && !board.value.team1.bottom) {
        names.team1 = `لم يتم تحديد لاعبى الفريق`;
      }

      if (board.value.team2.left && board.value.team2.right) {
        names.team2 = `${players.value[board.value.team2.right].name} | ${
          players.value[board.value.team2.left].name
        }`;
      } else if (!board.value.team2.left && board.value.team2.right) {
        names.team2 = `${players.value[board.value.team2.right].name}`;
      } else if (board.value.team2.left && !board.value.team2.right) {
        names.team2 = `${players.value[board.value.team2.left].name}`;
      } else if (!board.value.team2.left && !board.value.team2.right) {
        names.team2 = `لم يتم تحديد لاعبى الفريق`;
      }
      return names;
    } else {
      return {
        team1: board.value.team1.manualName,
        team2: board.value.team2.manualName,
      };
    }
  } else {
    return null;
  }
});

const winner = computed(() => {
  if (total.value.team1 < WiNNING_SCORE && total.value.team2 < WiNNING_SCORE) {
    return null;
  } else if (
    total.value.team1 >= WiNNING_SCORE ||
    total.value.team2 >= WiNNING_SCORE
  ) {
    if (total.value.team1 === total.value.team2) return null;
    else {
      if (total.value.team1 > total.value.team2) return "team1";
      else {
        return "team2";
      }
    }
  }
});

const teamSponcers = computed(() => {
  if (sponcers.value && board.value) {
    return {
      team1: sponcers.value[board.value.team1.sponcer],
      team2: sponcers.value[board.value.team2.sponcer],
    };
  } else return null;
});

const hideScore = ref(false);

const COMPS = computed(() => {
  if (board.value && players.value)
    return {
      Score: {
        comp: Score,
        props: {
          team1Name: teamsNames.value.team1,
          team2Name: teamsNames.value.team2,
          team1TotalScore: total.value.team1,
          team2TotalScore: total.value.team2,
          hide: hideScore.value,
          send: send,
        },
      },
      DetailedScore: {
        comp: DetailedScore,
        props: {
          state: board.value,
          teamsNames: teamsNames.value,
          total: total.value,
          send: send,
          teamSponcers: teamSponcers.value,
          stateMachine: stateMachine.value,
        },
      },
      Winner: {
        comp: WinnerView,
        props: {
          // winner: teamsNames.value[winner.value],
          winnerTeam: winner.value,
          players: players.value,
          board: board.value,
          teamsNames: teamsNames.value,
          send: send,
        },
      },
    };
});

const { state: stateMachine, send } = useMachine(showMachine, {
  guards: {
    hasWinner: () => {
      console.log("checking winner");
      return winner.value !== null;
    },
  },
  actions: {
    showScore: () => {
      hideScore.value = false;
    },
    trackTheStartingOfAnimation: async () => {
      console.log("start the animations tracking : true ");
      board.value.animationRunning = true;
      updateDoc(ENV, board.value);
    },
    trackTheEndingOfAnimation: async () => {
      console.log("end the animations tracking : false ");
      board.value.animationRunning = false;
      updateDoc(ENV, board.value);
    },
  },
});

watch(
  () => [total.value, board.value],
  (newVal, oldVal) => {
    if (
      oldVal[1] !== null &&
      (newVal[0].team1 > oldVal[0].team1 ||
        newVal[0].team2 > oldVal[0].team2) &&
      stateMachine.value.value === "Score"
    ) {
      console.log("start end transition of the score");
      hideScore.value = true;
    }
  }
);
</script>

<style scoped>
* {
  font-family: "CairoSemiBold";

  background-color: rgba(0, 0, 0, 0);

  /* background-color: rgba(0, 177, 64); green screen */
  height: 1080px;
  width: 1920px;
}
</style>
