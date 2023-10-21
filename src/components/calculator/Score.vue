<template>
  <div ref="parentElm" class="score-style">
    <div class="playerOne">
      <div id="playerOneElm" class="bg-dark bg-gradient">
        <div class="centerPlayerOne">
          <p v-if="team1Name.length > NUMBER_OF_CHARS_TO_TRIGGER ||
            team2Name.length > NUMBER_OF_CHARS_TO_TRIGGER
            " class="">
            <template v-for="(t, index) in team1Name.split('|')" :key="index">
              <p class="pb-0">{{ t }}</p>
            </template>
          </p>
          <p v-else>{{ team1Name }}</p>
        </div>
      </div>

      <div id="playerOneScoreElm" data-dir="-1">
        <p class="totalScoreOne">
          {{ tweenedScores.playerOne.toFixed(0) }}
        </p>
      </div>
    </div>

    <div class="playerTwo">
      <div id="playerTwoScoreElm" data-dir="1">
        <p class="totalScoreTwo">
          {{ tweenedScores.playerTwo.toFixed(0) }}
        </p>
      </div>
      <div id="playerTwoElm" class="bg-dark bg-gradient">
        <div class="centerPlayerTwo">
          <p v-if="team1Name.length > NUMBER_OF_CHARS_TO_TRIGGER ||
            team2Name.length > NUMBER_OF_CHARS_TO_TRIGGER
            " class="">
            <template v-for="(t, index) in team2Name.split('|')" :key="index">
              <p class="pb-0">{{ t }}</p>
            </template>
          </p>
          <p v-else>{{ team2Name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import { reactive, watch, onMounted, ref } from "vue";
export default {
  props: [
    "team1Name",
    "team2Name",
    "team1TotalScore",
    "team2TotalScore",
    "hide",
    "send",
  ],
  setup(props) {
    const NUMBER_OF_CHARS_TO_TRIGGER = 16;
    const tweenedScores = reactive({
      playerOne: 0,
      playerTwo: 0,
    });
    // watch scores for tweening
    watch(
      () => [props.team1TotalScore, props.team2TotalScore],
      () => {
        gsap.to(tweenedScores, {
          playerOne: props.team1TotalScore,
          playerTwo: props.team2TotalScore,
          duration: 0.75,
        });
      }
    );

    const parentElm = ref(null);

    const onComplete = () => {
      console.log("send SCORE_INCREASED from Score");
      props.send("SCORE_INCREASED");
    };

    const scoreMount = (el) => {
      const t1 = gsap.timeline();
      const playerOneElm = el.querySelector("#playerOneElm");
      const playerTwoElm = el.querySelector("#playerTwoElm");
      const playerOneScoreElm = el.querySelector("#playerOneScoreElm");
      const playerTwoScoreElm = el.querySelector("#playerTwoScoreElm");

      t1.set([playerOneElm, playerTwoElm], {
        opacity: 0,
      });
      t1.from([playerOneScoreElm, playerTwoScoreElm], {
        duration: 1,
        y: -200,
        ease: "power2",
      });
      t1.to(tweenedScores, {
        playerOne: props.team1TotalScore,
        playerTwo: props.team2TotalScore,
        duration: 0.75,
      });
      t1.set([playerOneElm, playerTwoElm], {
        opacity: 1,
      });

      t1.from([playerOneElm, playerTwoElm], {
        duration: 1,
        width: 0,
        ease: "bounce.out",
      });
      t1.from([playerOneElm.children, playerTwoElm.children], {
        duration: 0.25,
        opacity: 0,
      });
    };

    const scoreUnMount = (el) => {
      const t2 = gsap.timeline({
        onComplete: onComplete,
      });
      const playerOne = el.querySelector(".playerOne");
      const playerTwo = el.querySelector(".playerTwo");
      t2.to([playerOne, playerTwo], {
        duration: 0.5,
        x: (dir) => {
          return dir === 0 ? 500 : -500;
        },
        ease: "linear",
      });
    };

    onMounted(() => {
      console.log("entering Score Component");
      scoreMount(parentElm.value);
    });

    watch(
      () => props.hide,
      () => {
        if (props.hide) {
          console.log("leaving Score Component");
          scoreUnMount(parentElm.value);
        }
      }
    );

    return {
      tweenedScores,
      parentElm,
      NUMBER_OF_CHARS_TO_TRIGGER,
    };
  },
};
</script>

<style scoped>
.hidden-dots {
  opacity: 0;
}

.score-style {
  color: aliceblue;
  width: 100vw;
  font-family: "CairoSemiBold";
  font-size: 2.4rem;
}

.playerOne,
.playerTwo {
  position: fixed;
  top: var(--score-margin);

  height: var(--score-height);
  width: var(--score-width);
}

.playerOne {
  left: calc(50% + 2.5rem);
}

.playerTwo {
  right: calc(50% + 4.6rem);
}

#playerOneElm p,
#playerTwoElm p {
  padding: 0 0 0.5rem 0;
  margin: 0px;
}

#playerOneElm,
#playerTwoElm {
  height: var(--score-height);
  width: var(--score-width);
  display: flex;
  align-items: center;
  justify-content: center;
}

#playerOneElm {
  position: absolute;
  left: calc((var(--score-radius) / 2) - var(--score-overlap));
  border-radius: 0px 15px 50px 0px;
}

#playerTwoElm {
  position: absolute;
  right: calc((var(--score-radius) / 2) - var(--score-overlap));
  border-radius: 15px 0px 0px 50px;
}

.centerPlayerOne,
.centerPlayerTwo {
  position: absolute;
  height: var(--score-height);
  width: calc(var(--score-width) - (var(--score-radius) / 2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-family: Cairo;
  font-weight: 900;
  /* padding-top: 0.5rem; */
  line-height: 140%;
}

.centerPlayerOne {
  left: var(--score-overlap);
}

.centerPlayerTwo {
  right: var(--score-overlap);
}

#playerOneScoreElm,
#playerTwoScoreElm {
  height: var(--score-radius);
  width: var(--score-radius);
  position: absolute;
  top: calc((var(--score-radius) - var(--score-height)) / -2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

#playerOneScoreElm {
  /* background: linear-gradient(45deg, #f2f3f3, #ed1c24); */
  background-color: #000000;
  left: -3.5rem;
  border-radius: 50px 15px;
}

#playerTwoScoreElm {
  /* background: linear-gradient(-45deg, #f2f3f3, #ed1c24); */
  background-color: #ed1c24;

  right: -3.5rem;
  border-radius: 15px 50px;
}

.totalScoreOne,
.totalScoreTwo {
  padding: 0px;
  margin: 0px;
  font-family: "Courier New", Courier, monospace;
  font-size: 3.1rem;
  font-weight: 900;
}
</style>
