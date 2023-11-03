<template>
    <div class="winner-comp" ref="winnerComp">
        <div id="winner-data" ref="winnerData">
            <p id="winner-word">{{ winnerText }}</p>
            <p id="winner-name">
                {{ matchData[matchData.winner].name }}
            </p>
        </div>
        <div id="winner-images" ref="winnerImages">
            <div id="player1-img-wrapper" class="wrapper">
                <img :src="matchData.winner === 'team1' ? '/images/BlackFrame.svg' : '/images/RedFrame.svg'" />
                <preview id="image1" class="image" :width="139" :height="194"
                    :image="matchData[matchData.winner].player1.image"
                    :coordinates="matchData[matchData.winner].player1.coordinates" />
            </div>
            <div id="player2-img-wrapper" class="wrapper">
                <img :src="matchData.winner === 'team1' ? '/images/BlackFrame.svg' : '/images/RedFrame.svg'" />
                <preview id="image2" class="image" :width="139" :height="194"
                    :image="matchData[matchData.winner].player2.image"
                    :coordinates="matchData[matchData.winner].player2.coordinates" />
            </div>
        </div>
        <video ref="mediaElm" class="video-elm" @ended="handleVideoEnd" muted src="/videos/Winner.webm" height="1080"
            @timeupdate="handleTimeUpdate" width="1920"></video>
    </div>
</template>

<script setup>
import { Preview, } from "vue-advanced-cropper";
import gsap from "gsap";
import { onMounted, ref } from "vue"
import { useNashraStore } from "@/stores/NashraStore.js"
import { storeToRefs } from 'pinia'

const NashraStore = useNashraStore();
const { matchData, winnerText } = storeToRefs(NashraStore);

const mediaElm = ref(null);

const winnerData = ref(null);
const winnerImages = ref(null);
const winnerComp = ref(null)
const scoreMount = () => {
    const t1 = gsap.timeline();
    t1.to([winnerData.value, winnerImages.value], {
        duration: 0.75,
        opacity: 1,
        ease: "bounce.out",
    });

};

const scoreUnMount = () => {
    const t2 = gsap.timeline();
    t2.to([winnerComp.value], {
        duration: 1,
        opacity: 0,
        ease: "bounce.out",
    });
};

const handleVideoEnd = () => {
    NashraStore.SendAnimationEndedSignal();
}

const handleTimeUpdate = (() => {
    let enterDone = false;
    let leaveDone = false;

    return () => {
        if (mediaElm.value.currentTime >= 1.2 && !enterDone) {
            enterDone = true;
            scoreMount();
        }
        if (mediaElm.value.currentTime >= 4 && !leaveDone) {
            leaveDone = true;
            scoreUnMount();
        }
    }
})();

onMounted(() => {
    mediaElm.value.play();
})



</script>

<style scoped>
.winner-comp {
    position: relative;
}

.video-elm {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

#winner-data {
    position: absolute;
    font-family: "arefBold";
    font-size: 3.75rem;
    top: 450px;
    left: 380px;
    opacity: 0;
}

#winner-data p {
    padding: 0;
    margin: 0;
    width: 500px;
    text-align: start;
    /* background-color: aqua; */
    background-image: linear-gradient(to right,
            #462523 0,
            #cb9b51 22%,
            #f6e27a 45%,
            #f6f2c0 50%,
            #f6e27a 55%,
            #cb9b51 78%,
            #462523 100%);
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
}

#winner-word {
    font-size: 2.75rem;
}

#winner-images {
    position: absolute;
    /* background-color: black; */
    width: 295px;
    height: 194px;
    top: 443px;
    left: 1113px;
    border-radius: 10px;
    opacity: 0;

}

.wrapper {
    position: absolute;
    /* background-color: rgba(0, 255, 255, 0.377); */
    height: 194px;
    width: 139px;
    overflow: hidden;
    border-radius: 10px;
}

#player1-img-wrapper {
    left: 0px;
}

#player2-img-wrapper {
    right: 0px;
}

.image {
    position: absolute;
    top: 0;
    z-index: -1;
}
</style>