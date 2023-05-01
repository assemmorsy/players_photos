<template>
  <div ref="parentElm" id="detailed-score">
    <div id="playerOne">
      <div class="header">
        <div class="total-score">
          <p class="p-0 m-0 pb-1">{{ tweenedScores.playerOne.toFixed(0) }}</p>
        </div>

        <div class="name">
          <p>{{ teamsNames.team1 }}</p>
        </div>

        <preview
          v-if="teamSponcers"
          class="imageContainer"
          :image="teamSponcers.team1.image"
          :coordinates="teamSponcers.team1.coordinates"
        />
      </div>
      <div class="detailed-scores">
        <p
          v-for="(score, index) in state.team1.scores"
          :key="index"
          :data-index="index"
          style="-webkit-text-stroke: 1px #000"
        >
          {{ score }}
        </p>
      </div>
    </div>

    <div id="playerTwo">
      <div class="header">
        <div class="total-score">
          <p class="p-0 m-0 pb-1">{{ tweenedScores.playerTwo.toFixed(0) }}</p>
        </div>
        <div class="name">
          <p>{{ teamsNames.team2 }}</p>
        </div>
        <preview
          v-if="teamSponcers"
          class="imageContainer"
          :image="teamSponcers.team2.image"
          :coordinates="teamSponcers.team2.coordinates"
        />
      </div>

      <div class="detailed-scores">
        <p
          v-for="(score, index) in state.team2.scores"
          :key="index"
          :data-index="index"
          style="-webkit-text-stroke: 1px #000"
        >
          {{ score }}
        </p>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, watch } from "vue";
import { Preview } from "vue-advanced-cropper";
import { gsap } from "gsap";
export default {
  props: [
    "state",
    "teamsNames",
    "total",
    "send",
    "teamSponcers",
    "stateMachine",
  ],
  components: { Preview },
  setup(props) {
    const parentElm = ref(null);

    const tweenedScores = reactive({
      playerOne: 0,
      playerTwo: 0,
    });
    // watch scores for tweening
    watch(
      () => [props.total.team2, props.total.team1],
      () => {
        gsap.to(tweenedScores, {
          playerOne: props.total.team1,
          playerTwo: props.total.team2,
          duration: 0.75,
        });
      }
    );
    const onCompleteEndAnimation = () => {
      console.log("send FINISH_DETAILED from Detailed");
      props.send("FINISH_DETAILED");
    };
    let timer = null;
    const onCompleteStartAnimation = () => {
      timer = setTimeout(() => {
        console.log("leaving Details Component");
        timer = null;
        scoreUnMount(parentElm.value);
      }, 4000);
    };

    const scoreMount = (el) => {
      const POTotalScore = el.querySelector("#playerOne .total-score");
      const PTTotalScore = el.querySelector("#playerTwo .total-score");
      const POName = el.querySelector("#playerOne .name");
      const PTName = el.querySelector("#playerTwo .name");
      const POImage = el.querySelector("#playerOne .imageContainer");
      const PTImage = el.querySelector("#playerTwo .imageContainer");
      const line = el.querySelector(".line");
      const POScores = el.querySelector("#playerOne .detailed-scores");
      const PTScores = el.querySelector("#playerTwo .detailed-scores");

      const t1 = gsap.timeline({
        onComplete: onCompleteStartAnimation,
      });

      t1.from([POImage, PTImage], {
        y: -300,
        duration: 0.5,
        ease: "power4",
      });

      t1.addLabel("move");
      t1.from(
        [POTotalScore, PTTotalScore],
        {
          y: -300,
          duration: 0.25,
          ease: "power4",
        },
        "move"
      );
      t1.to(
        tweenedScores,
        {
          playerOne: props.total.team1,
          playerTwo: props.total.team2,
          duration: 0.75,
        },
        "move"
      );
      t1.to(
        POImage,
        {
          right: "-6.75rem",
          duration: 1,
          ease: "power4",
        },
        "move"
      );
      t1.to(
        PTImage,
        {
          right: "28.25rem",
          duration: 1,
          ease: "power4",
        },
        "move"
      );
      t1.from(
        PTName,
        {
          width: 0,
          duration: 1,
          ease: "power4",
        },
        "move"
      );
      t1.from(
        POName,
        {
          x: "-30rem",
          width: 0,
          duration: 1,
          ease: "power4",
        },
        "move"
      );
      t1.addLabel("showAll");
      t1.from(
        PTScores.children,
        {
          duration: 0.75,
          scale: 0.5,
          opacity: 0,
          stagger: 0.1,
          ease: "elastic",
        },
        "showAll"
      );
      t1.from(
        POScores.children,
        {
          duration: 0.75,
          scale: 0.5,
          opacity: 0,
          stagger: 0.1,
          ease: "elastic",
        },
        "showAll"
      );
      t1.from(
        line,
        {
          height: 0,
          duration: 0.25,
        },
        "showAll"
      );

      t1.to(
        [POName.children, PTName.children],
        {
          opacity: 1,
          duration: 0.25,
        },
        "showAll"
      );
    };

    const scoreUnMount = (el) => {
      const PO = el.querySelector("#playerOne ");
      const PT = el.querySelector("#playerTwo ");
      const line = el.querySelector(".line");
      const POScores = el.querySelector("#playerOne .detailed-scores");
      const PTScores = el.querySelector("#playerTwo .detailed-scores");

      const t1 = gsap.timeline({
        onComplete: onCompleteEndAnimation,
      });
      t1.to(
        line,
        {
          height: 0,
          duration: 0.3,
        },
        "<"
      );
      t1.to(
        POScores.children,
        {
          duration: 0.75,
          scale: 0.5,
          opacity: 0,
          stagger: 0.1,
          ease: "elastic",
        },
        "<"
      );
      t1.to(
        PTScores.children,
        {
          duration: 0.75,
          scale: 0.5,
          opacity: 0,
          stagger: 0.1,
          ease: "elastic",
        },
        "<"
      );
      t1.to(
        [PO, PT],
        {
          duration: 0.25,
          y: -300,
        },
        ">"
      );
    };

    onMounted(() => {
      console.log("entering Details Component");
      scoreMount(parentElm.value);
    });

    watch(
      () => [props.total],
      () => {
        if (props.state && timer) {
          console.log("wait 3000 s ");
          clearTimeout(timer);
          timer = setTimeout(() => {
            console.log("leaving Details Component after waiting +4s ...");
            timer = null;
            scoreUnMount(parentElm.value);
          }, 3000);
        }
      }
    );

    return { parentElm, tweenedScores };
  },
};
</script>

<style scoped>
#detailed-score {
  font-family: "CairoSemiBold";
  padding-top: var(--detail-header-height);
  color: aliceblue;
  font-size: 2.7rem;
  display: flex;
  justify-content: space-around;
}
.header {
  height: var(--detail-margin);
  width: var(--detail-header-width);
  position: relative;
}
.imageContainer {
  height: var(--detail-radius);
  width: var(--detail-radius);
  border-radius: 30px;
  position: absolute;
  top: calc((var(--detail-radius) - var(--detail-header-height)) / -2);
  border: #f6b033 solid 2px;
}
#playerOne .imageContainer {
  left: calc(
    ((var(--detail-radius) - var(--detail-header-height)) / 2) -
      var(--detail-radius)
  );
  transform: skewX(-10deg);
  background-repeat: no-repeat;
  background-size: cover;
}
#playerTwo .imageContainer {
  right: -6.75rem;
  transform: skewX(10deg);
  background-repeat: no-repeat;
  background-size: cover;
}

.name {
  height: var(--detail-header-height);
  width: var(--detail-header-width);
  margin: 0px;
  padding-top: 0.5rem;
  font-size: 2.1rem;
}
.name p {
  opacity: 0;
}
#playerOne .name {
  background-image: linear-gradient(to right, #e4342a, #f6b033);
}

#playerTwo .name {
  background-image: linear-gradient(to right, #e4342a, #f6b033);
}

.total-score {
  height: var(--detail-radius);
  width: var(--detail-radius);
  border-radius: 30px;
  position: absolute;
  top: calc((var(--detail-radius) - var(--detail-header-height)) / -2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  border: whitesmoke solid 3px;
  z-index: 5;
}
#playerOne .total-score {
  background-color: #e4342a;
  left: calc(
    ((var(--detail-radius) - var(--detail-header-height)) / 2) -
      var(--detail-radius)
  );
  transform: skewX(10deg);
}
#playerTwo .total-score {
  background-color: #f6b033;
  right: calc(
    ((var(--detail-radius) - var(--detail-header-height)) / 2) -
      var(--detail-radius)
  );
  transform: skewX(-10deg);
}
#playerOne .total-score p {
  transform: skewX(-10deg);
}
#playerTwo .total-score p {
  transform: skewX(10deg);
}
.detailed-scores {
  margin-top: 20px;
}
.detailed-scores p {
  margin: -13px 0px;
  font-size: 3rem;
}
.line {
  position: absolute;
  top: 25%;
  height: 60%;
  width: 1rem;
  background-image: linear-gradient(to top right, #e4342a, #f6b033);
  border-radius: 20px;
}
</style>
