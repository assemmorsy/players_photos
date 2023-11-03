<template>
    <div class="score-comp">
        <video ref="mediaElm" class="video-elm" @timeupdate="handleTimeUpdate" @ended="handleVideoEnd" muted
            src="/videos/Corner_Score.webm" height="1080" width="1920"></video>
        <div id="team1wrapper" ref="team1wrapper">
            <preview id="rightSponsor" class="imageContainer" :image="matchData.team1.sponsorLogo.image"
                :coordinates="matchData.team1.sponsorLogo.coordinates" />

            <p id="team1name">
                {{ matchData.team1.name }}
            </p>

            <p id="team1totalScore">{{ tweenedScores.team1.toFixed(0) }}</p>
        </div>

        <div id="team2wrapper" ref="team2wrapper">
            <p id="team2totalScore">{{ tweenedScores.team2.toFixed(0) }}</p>

            <p id="team2name">
                {{ matchData.team2.name }}
            </p>
            <preview id="leftSponsor" class="imageContainer" :image="matchData.team2.sponsorLogo.image"
                :coordinates="matchData.team2.sponsorLogo.coordinates" />
        </div>
    </div>
</template>

<script setup>
import { Preview, } from "vue-advanced-cropper";
import gsap from "gsap";
import { onMounted, ref, watchEffect, reactive, watch } from "vue"
import { useNashraStore } from "@/stores/NashraStore.js"
import { storeToRefs } from 'pinia'

console.log("from score view");
const NashraStore = useNashraStore();
const { currentStateNames, matchData } = storeToRefs(NashraStore);

const mediaElm = ref(null);

const team1wrapper = ref(null);
const team2wrapper = ref(null);


const tweenedScores = reactive({
    team1: 0,
    team2: 0,
});
watch(
    () => [matchData.value.team1.totalScore, matchData.value.team2.totalScore],
    (newVal, oldVal) => {
        if (newVal[0] < oldVal[0] || newVal[1] < oldVal[1])
            gsap.to(tweenedScores, {
                team1: matchData.value.team1.totalScore,
                team2: matchData.value.team2.totalScore,
                duration: 0.75,
            });
    }
);

const scoreMount = () => {
    const t1 = gsap.timeline();
    t1.delay(1.75);
    t1.to([team1wrapper.value, team2wrapper.value], {
        duration: 0.75,
        opacity: 1,
        ease: "bounce.out",
    });
    t1.to(tweenedScores, {
        team1: matchData.value.team1.totalScore,
        team2: matchData.value.team2.totalScore,
        duration: 0.5,
        ease: 'linear'
    });

};

const scoreUnMount = () => {
    const t2 = gsap.timeline();
    t2.to([team1wrapper.value, team2wrapper.value], {
        duration: 0.6,
        y: -80,
        opacity: 0,
        ease: "circ.in",
    });
};

const handleVideoEnd = () => {
    console.log(`video ended at current time : ${mediaElm.value.currentTime}`);
    NashraStore.SendAnimationEndedSignal();
}

const handleTimeUpdate = (() => {
    let done = false;
    return () => {
        if (mediaElm.value.currentTime >= 3 && !done) {
            mediaElm.value.pause();
            NashraStore.SendAnimationEndedSignal();
            done = true;
            console.log(` current time is reach ${mediaElm.value.currentTime} and Done function : ${done}`);
        }
    }
})();

const startEnterAnimation = () => {
    console.log("from startEnterAnimation ");
    onMounted(() => {
        mediaElm.value.play();
        scoreMount();
    })
}

const startLeaveAnimation = () => {
    console.log("from startLeaveAnimation");
    mediaElm.value.playbackRate = 2.0
    mediaElm.value.play();

    scoreUnMount();
}

watchEffect(() => {
    switch (currentStateNames.value[1]) {
        case "score.enterScoreAnimation":
            startEnterAnimation();
            break;
        case "score.scoreComp":
            break;
        case "score.leaveScoreAnimation":
            startLeaveAnimation();
            break;
    }
})
</script>

<style scoped>
/* .score-comp{} */

.video-elm {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

#team1wrapper,
#team2wrapper {
    font-family: "arefBold";
    color: white;
    /* background-color: bisque; */
    text-align: center;
    width: 324px;
    height: 62px;
    top: 16px;
    position: absolute;
    opacity: 0;
}

#team1wrapper {
    left: 976px;
}

#team2wrapper {
    left: 621px;
}

#team1name,
#team2name {
    position: absolute;
    font-size: 1.75rem;
    top: 6px;
    /* background-color: aqua; */
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#team1name {
    width: 185px;
    left: 56px;
}

#team2name {
    width: 187px;
    left: 82px;
}

#team1totalScore,
#team2totalScore {
    position: absolute;
    font-family: "CairoSemiBold";
    font-size: 1.6rem;
    top: 0px;
    width: 55px;
    height: 62px;
    /* background-color: aqua; */
    display: flex;
    justify-content: center;
    align-items: center;
}

#team1totalScore {
    left: 0px;
}

#team2totalScore {
    left: 269px;
}

#leftSponsor,
#rightSponsor {
    position: absolute;
    width: 66px;
    height: 62px;
    top: -2px;
}

#leftSponsor {
    left: 5px;
}

#rightSponsor {
    left: 256px;
}
</style>