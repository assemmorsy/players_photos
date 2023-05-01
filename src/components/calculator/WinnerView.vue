<template>
  <div
    class="main d-flex justify-content-center align-items-center"
    v-if="winner"
  >
    <div
      class="winner-container d-flex justify-content-between"
      :style="
        winner.team === 'team1'
          ? 'background: linear-gradient(45deg, #32b8f7, #193c73);'
          : 'background: linear-gradient(45deg, #e7442b, #f7ac32);'
      "
    >
      <div class="image-container" id="image-container-right">
        <img :src="winner.p1.frame" id="right-box" class="box" />
        <preview
          id="right-image"
          class="image rounded-3"
          :image="winner.p1.image"
          :coordinates="winner.p1.coordinates"
        />
      </div>

      <div
        class="
          winner-name
          text-white
          d-flex
          align-items-center
          flex-column
          justify-content-center
          h-100
        "
      >
        <div class="d-flex mx-5">
          <img class="icon" :src="svgs[0]" />
          <img class="icon" :src="svgs[1]" />
          <p class="d-inline-block mx-3 mb-0" style="font-size: 2rem">
            {{ winner.text }}
          </p>
          <img class="icon" :src="svgs[2]" />
          <img class="icon" :src="svgs[3]" />
        </div>
        <p class="mx-5" style="font-size: 2.2rem">{{ winner.name }}</p>
      </div>

      <div class="image-container" id="image-container-left">
        <img :src="winner.p2.frame" id="left-box" class="box" />
        <preview
          id="left-image"
          class="image rounded-3"
          :image="winner.p2.image"
          :coordinates="winner.p2.coordinates"
        />
      </div>
    </div>
    <div class="images">
      <transition-group
        appear
        @before-enter="gameImgBeforeEnter"
        @enter="gameImgEnter"
      >
        <template v-for="x in [...Array(99).keys()]" :key="x">
          <img
            class="img-icon position-absolute"
            :src="svgs[x % 4]"
            :data-indexgame="x"
          />
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue ";
import { Preview } from "vue-advanced-cropper";
import gsap from "gsap";
const props = defineProps([
  "winnerTeam",
  "players",
  "board",
  "send",
  "teamsNames",
]);
const TIME_AMOUNT_VIEWING_WINNER = 4000;

const gameImgBeforeEnter = (el) => {
  el.opacity = 1;
};
const gameImgEnter = (el) => {
  gsap.to(el, {
    duration: 2,
    opacity: 0,
    y: `${Math.floor((Math.random() - 0.5) * 1000)}`,
    x: `${Math.floor((Math.random() - 0.5) * 1000)}`,
    delay: parseInt(el.dataset.indexgame) * 0.05,
    rotateZ: `${Math.floor(Math.random() * 360)}`,
  });
};

const winner = computed(() => {
  if (props.players && props.board && props.teamsNames && props.winnerTeam) {
    let state = {
      name: props.teamsNames[props.winnerTeam],
      team: props.winnerTeam,
      text: props.board.winnerText,
    };
    if (props.winnerTeam === "team1") {
      state.p1 = {
        ...props.players[props.board["team1"].top],
        frame: new URL("@/assets/images/top-square.svg", import.meta.url).href,
      };
      state.p2 = {
        ...props.players[props.board["team1"].bottom],
        frame: new URL("@/assets/images/bottom-square.svg", import.meta.url)
          .href,
      };
    } else if (props.winnerTeam === "team2") {
      state.p1 = {
        ...props.players[props.board["team2"].right],
        frame: new URL("@/assets/images/right-square.svg", import.meta.url)
          .href,
      };
      state.p2 = {
        ...props.players[props.board["team2"].left],
        frame: new URL("@/assets/images/left-square.svg", import.meta.url).href,
      };
    }
    return state;
  } else {
    return null;
  }
});

const svgs = [
  new URL("../../assets/images/1.svg", import.meta.url).href,
  new URL("../../assets/images/2.svg", import.meta.url).href,
  new URL("../../assets/images/3.svg", import.meta.url).href,
  new URL("../../assets/images/4.svg", import.meta.url).href,
];

onMounted(() => {
  console.log("entering Winner Component");
  winnerMount();
});

const winnerMount = () => {
  const t1 = gsap.timeline({
    onComplete: onCompleteStartAnimation,
  });
  t1.set(".winner-container", {
    opacity: 0,
    width: 0,
  });
  t1.set(".winner-name", {
    opacity: 0,
    scale: 0,
  });
  t1.to(".winner-container", {
    opacity: 1,
    width: "50vw",
  });
  t1.to(".winner-name", {
    opacity: 1,

    scale: 1,
  });
};

const winnerUnMount = () => {
  const t2 = gsap.timeline({
    onComplete: onCompleteEndAnimation,
  });
  t2.to(".winner-name", {
    opacity: 0,
    scale: 0,
  });
  t2.to(".winner-container", {
    background: "rgba(0, 0, 0, 0)",
    width: 0,
  });
  t2.to(
    "#image-container-right",
    {
      x: 1080,
      duration: 0.5,
      ease: "linear",
    },
    "<"
  );
  t2.to(
    "#image-container-left",
    {
      x: -1080,
      duration: 0.5,
      ease: "linear",
    },
    "<"
  );
};

const onCompleteEndAnimation = () => {
  console.log("send FINISH_WINNER from Winner");
  props.send("FINISH_WINNER");
};

const onCompleteStartAnimation = () => {
  setTimeout(() => {
    console.log("leaving Winner Component");
    winnerUnMount();
  }, TIME_AMOUNT_VIEWING_WINNER);
};
</script>

<style scoped>
.main {
  background-color: rgba(0, 0, 0, 0) !important;
  background-image: none !important;
  height: 1080px;
  width: 1920px;
}
.icon {
  height: 40px;
  widows: 40px;
  margin: 0 5px;
}
.image {
  position: absolute;
}
.box {
  position: absolute;
  height: var(--winner-box-size);
  width: var(--winner-box-size);
  z-index: 1;
}
.image-container {
  position: relative;
  height: var(--winner-box-size);
  width: var(--winner-box-size);
}

.winner-container {
  height: var(--winner-box-size);
  /* width: 50vw; */
  border-radius: 5rem;
}
#left-box {
  top: 0px;
  right: 0px;
}
#right-box {
  top: 0px;
  left: 0px;
  transform: rotate(180deg);
}
#right-image,
#left-image {
  height: calc(var(--winner-box-size) - 20px);
  width: calc(var(--winner-box-size) - 20px);
  top: 10px;
}

#left-image {
  right: 10px;
}
#right-image {
  left: 10px;
}
.img-icon {
  top: 50vh;
  right: 50vw;
  transform: translateX(50%) translateY(-50%);
  height: 50px;
  width: 50px;
  z-index: -1;
}
</style>