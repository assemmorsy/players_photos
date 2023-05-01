<template>
  <div class="container" v-if="board && players">
    <div class="
                  row
                  justify-content-around
                  pt-4
                  text-center
                  bg-success
                  position-relative
                ">
      <div class="
                    mb-3
                    col col-6
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-end
                  ">
        <p type="text" class="
                      form-control
                      border-0 border-bottom
                      bg-success
                      text-light
                      border-light
                    ">
          {{ teamsNames.team1 }}
        </p>
        <p class="total text-light fs-1">
          {{ total.team1 }}
        </p>
      </div>

      <div class="
                    mb-3
                    col col-6
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-end
                  ">
        <p type="text" class="
                      form-control
                      border-0 border-bottom
                      bg-success
                      text-light
                      border-light
                    ">
          {{ teamsNames.team2 }}
        </p>
        <p class="total text-light fs-1">
          {{ total.team2 }}
        </p>
      </div>

      <div class="position-absolute top-100 start-50 translate-middle">
        <button class="btn btn-success qayyed border rounded-circle border-3" @click="handleQayyed">
          <i class="bi bi-send icon"></i>
        </button>
      </div>
    </div>

    <div v-if="!winner" class="row justify-content-around text-center pt-3">
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <div class="col col-6">
            <input type="tel" class="form-control border-0 shadow p-2" v-model="tempScores.team1" id="team1"
              @keypress.prevent="validateNumber" />
          </div>
        </div>
      </div>
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <div class="col col-6">
            <input type="tel" class="form-control border-0 shadow p-2" v-model="tempScores.team2" id="team2"
              @keypress.prevent="validateNumber" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="winner" class="row justify-content-around text-center pt-5 text-success">
      <p>
        الفريق الفائز هو فريق <span> ( {{ teamsNames[winner] }} ) </span>
        <br />
      </p>
      <div v-if="!board.animationRunning">
        <p class="text-danger">هل تريد بدأ صكة جديدة ؟</p>
        <button class="btn btn-outline-danger mx-2 px-4" @click.prevent="handleDeleteAll">
          نعم
        </button>
      </div>
    </div>

    <div v-if="qayyedError" class="row justify-content-around text-center mt-1 text-danger">
      {{ qayyedError }}
    </div>

    <div class="row justify-content-around text-center mt-2" style="overflow-y: auto; height: 50vh">
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <transition-group name="scores" appear>
            <p v-for="(score, index) in board.team1.scores" :key="index">
              {{ score }}
            </p>
          </transition-group>
        </div>
      </div>
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <transition-group name="scores" appear>
            <p v-for="(score, index) in board.team2.scores" :key="index">
              {{ score }}
            </p>
          </transition-group>
        </div>
      </div>
    </div>

    <div class="row justify-content-center fixed-bottom mb-3">
      <div class="col col-2">
        <button class="btn btn-warning qayyed rounded-circle" @click="handleBack" :disabled="
          !(board.team1.scores.length > 0 && board.team2.scores.length > 0)
        ">
          <i class="bi bi-skip-backward icon"></i>
        </button>
      </div>

      <div class="col col-2">
        <button class="btn btn-danger qayyed rounded-circle" @click="handleDeleteAll"
          v-if="winner && !board.animationRunning">
          <i class="bi bi-trash3 icon"></i>
        </button>
      </div>

      <div class="col col-2">
        <button class="btn btn-primary qayyed rounded-circle" v-if="!logoutLoading" @click="handleLogout">
          <i class="bi bi-door-closed icon"></i>
        </button>
        <button class="btn btn-primary qayyed rounded-circle" disabled v-else>
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>

      <div class="row justify-content-center text-center">
        <div class="text-danger">{{ logoutError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount } from "vue";
import useLogout from "@/composables/useLogout.js";

import { useRouter } from "vue-router";

import getDocument from "@/composables/getDocument";
import useDocument from "@/composables/useDocument";

import getCollection from "@/composables/getCollectionAsDictionary";

const { error: boardError, doc: board, getDoc } = getDocument("board");
const { error: loadingPlayersError, documents: players } =
  getCollection("players");
const { error: loadingRecordsError, documents: records } =
  getCollection("records");

const { error: errorRecord, isPending: isPendingRecord, deleteDoc: deleteRecord, updateDoc: updateRecord } = useDocument("records");
const { error, isPending, deleteDoc, updateDoc } = useDocument("board");
const ENV = "prod";
const WiNNING_SCORE = 152;

onBeforeMount(async () => {
  await getDoc(ENV);
});

const router = useRouter();
const { error: logoutError, loading: logoutLoading, logout } = useLogout();
const qayyedError = ref(null);

const tempScores = ref({
  team1: "",
  team2: "",
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
        names.team1 = `${players.value[board.value.team1.top].name} | ${players.value[board.value.team1.bottom].name
          }`;
      } else if (!board.value.team1.top && board.value.team1.bottom) {
        names.team1 = `${players.value[board.value.team1.bottom].name}`;
      } else if (board.value.team1.top && !board.value.team1.bottom) {
        names.team1 = `${players.value[board.value.team1.top].name}`;
      } else if (!board.value.team1.top && !board.value.team1.bottom) {
        names.team1 = `لم يتم تحديد لاعبى الفريق`;
      }

      if (board.value.team2.left && board.value.team2.right) {
        names.team2 = `${players.value[board.value.team2.right].name} | ${players.value[board.value.team2.left].name
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

const handleLogout = async () => {
  await logout();
  if (!logoutError.value) router.push({ name: "login" });
};

const handleDeleteAll = async () => {
  board.value.team1.scores = [];
  board.value.team2.scores = [];
  board.value.isChanged = false;
  tempScores.value = {
    team1: "",
    team2: "",
  };
  qayyedError.value = null;
  await handleRecord("delete");
  await updateDoc(ENV, board.value);
};

const handleRecord = async (eventName) => {
  if (board.value && board.value.record.state === "running") {
    let record = records.value[board.value.record.id];
    record.records.push({
      startAt: new Date() - record.createdAt.seconds * 1000,
      event: eventName,
      data: {
        "team1": {
          "name": teamsNames.value.team1,
          "scores": board.value.team1.scores,
        },
        "team2": {
          "name": teamsNames.value.team2,
          "scores": board.value.team2.scores,
        },
        winner: winner.value,
      }
    })
    await updateRecord(board.value.record.id, record)
  }
}

const handleBack = async () => {
  if (
    board.value.team1.scores.length > 0 &&
    board.value.team2.scores.length > 0
  ) {
    board.value.team1.scores.pop();
    board.value.team2.scores.pop();
    await handleRecord("back");
    await updateDoc(ENV, board.value);
  }
};

const validateNumber = (event) => {
  qayyedError.value = null;
  const Numbers = "0123456789".split("");
  if (
    Numbers.includes(event.key) &&
    tempScores.value[event.target.id].length < 3
  ) {
    ["0", "", "-"].includes(tempScores.value[event.target.id])
      ? (tempScores.value[event.target.id] = event.key)
      : (tempScores.value[event.target.id] += event.key);
  }
};

const handleQayyed = async () => {
  qayyedError.value = null;
  tempScores.value.team1 === "" ? (tempScores.value.team1 = 0) : null;
  tempScores.value.team2 === "" ? (tempScores.value.team2 = 0) : null;
  let totalP1, totalP2;

  try {
    totalP1 = parseInt(tempScores.value.team1);
    totalP2 = parseInt(tempScores.value.team2);
  } catch (error) {
    console.error(error);
    qayyedError.value = "برجاء ادخال ارقام فقط";
  }

  if (totalP1 <= 300 && totalP2 <= 300 && (totalP1 >= 0 || totalP2 >= 0)) {
    board.value.team1.scores.push(totalP1);
    board.value.team2.scores.push(totalP2);
    tempScores.value.team1 = "";
    tempScores.value.team2 = "";
    board.value.animationRunning = true;
    await handleRecord("score increased");
    await updateDoc(ENV, board.value);
  } else {
    qayyedError.value = "برجاء ادخال النتيجة اقل من او تساوى 300";
  }
};
</script>

<style scoped>
.qayyed {
  width: 60px;
  height: 60px;
}

.line {
  background-color: black;
  height: 50vh;
  width: 1px;
}

.icon {
  font-size: 30px;
}

* {
  font-family: "cairoSemiBold";
}

.scores-enter-from {
  opacity: 0;
}

.scores-enter-to {
  opacity: 1;
}

.scores-enter-active {
  transition: opacity 0.7s ease;
}

.scores-leave-from {
  opacity: 1;
}

.scores-leave-to {
  opacity: 0;
}

.scores-leave-active {
  transition: opacity 0.7s ease;
}
</style>
