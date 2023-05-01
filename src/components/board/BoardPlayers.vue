<template>
  <div class="my-3 mx-md-3" v-if="playersArray && board">

    <div class="d-md-none">
      <div>
        <h6 class="lead">اختيار لاعبين الفريق الاول</h6>
        <div class="
          d-flex
          justify-content-around
          align-items-end
          flex-column flex-md-row
        ">
          <BoardSelect label="اللاعب الاول (اعلي الشاشة)" icon="bi-arrow-up-circle" :board="board" :options="players"
            :options-array="playersArray" team="team1" model="top" />
          <BoardSelect label="اللاعب الثاني (اسفل الشاشه)" icon="bi-arrow-down-circle" :board="board" :options="players"
            :options-array="playersArray" team="team1" model="bottom" />
        </div>
      </div>

      <hr />
      <div>
        <h6 class="lead">اختيار لاعبين الفريق الثاني</h6>
        <div class="
          d-flex
          justify-content-around
          align-items-end
          flex-column flex-md-row
        ">
          <BoardSelect label="اللاعب الاول (يمين الشاشه)" icon="bi-arrow-right-circle" :board="board" :options="players"
            :options-array="playersArray" team="team2" model="right" />
          <BoardSelect label="اللاعب الثاني (يسار الشاشه)" icon="bi-arrow-left-circle" :board="board" :options="players"
            :options-array="playersArray" team="team2" model="left" />
        </div>
      </div>
    </div>

    <div class="d-none d-md-flex w-100 flex-column justify-content-center align-items-center">
      <div class="row w-50 mb-3">
        <BoardSelect label="(اعلي الشاشة)" icon="bi-arrow-up-circle" :board="board" :options="players"
          :options-array="playersArray" team="team1" model="top" />
      </div>

      <div class="row w-100 my-3">
        <div class="col-5 d-flex align-items-center justify-content-center">
          <BoardSelect label="(يمين الشاشه)" icon="bi-arrow-right-circle" :board="board" :options="players"
            :options-array="playersArray" team="team2" model="right" />
        </div>
        <div class="col-2 text-center">
          <div class="board"></div>
        </div>
        <div class="col-5 d-flex align-items-center justify-content-center">
          <BoardSelect label="(يسار الشاشه)" icon="bi-arrow-left-circle" :board="board" :options="players"
            :options-array="playersArray" team="team2" model="left" />
        </div>
      </div>

      <div class="row w-50 mt-3">
        <BoardSelect label="(اسفل الشاشه)" icon="bi-arrow-down-circle" :board="board" :options="players"
          :options-array="playersArray" team="team1" model="bottom" />
      </div>

    </div>


    <hr />

    <div class="text-danger">
      {{ updatingError }}
    </div>

    <div class="text-center">
      <button class="btn btn-info mt-1 px-5" :class="board.hide ? 'btn-info' : 'btn-danger'"
        @click.prevent="handleToggleHide">
        {{ board.hide ? "اظهار النشرة" : "اخفاء النشرة" }}
        <span v-if="loadingUpdates" class="spinner-border spinner-border-sm ms-3" role="status" aria-hidden="true"></span>
      </button>
      <button class="btn btn-warning mt-1 px-5 mx-3" :disabled="loadingUpdates" @click.prevent="handleUpdate">
        تحديث
        <span v-if="loadingUpdates" class="spinner-border spinner-border-sm ms-3" role="status" aria-hidden="true"></span>
      </button>
      <button class="btn btn-success mt-1 px-5" :disabled="loadingUpdates" @click.prevent="handleSaka">
        صكة جديدة
        <span v-if="loadingUpdates" class="spinner-border spinner-border-sm ms-3" role="status" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import BoardSelect from "./BoardSelect.vue";
import useDocument from "@/composables/useDocument";
import { computed, onBeforeUnmount } from "vue";
const props = defineProps(["players", "sponcers", "board", "ENV", "records"]);
const playersArray = computed(() => {
  let result = null;
  if (props.players) {
    result = [
      {
        id: null,
        name: "لا يوجد لاعب",
      },
    ];
    for (let playerId in props.players) {
      result.push(props.players[playerId]);
    }
  }
  return result;
});

const {
  error: updatingError,
  isPending: loadingUpdates,
  updateDoc,
} = useDocument("board");

onBeforeUnmount(async () => {
  await updateDoc(props.ENV, props.board);
});
const handleUpdate = async () => {
  await updateDoc(props.ENV, props.board);
};
const handleSaka = async () => {
  props.board.team1.scores = [];
  props.board.team2.scores = [];
  await handleUpdate();
};
const handleToggleHide = async () => {
  props.board.hide = !props.board.hide;
  await handleUpdate();
};
</script>

<style scoped>
.board {
  width: 8rem;
  height: 8rem;

  border: brown 1rem solid;
  background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
  display: inline-block;
}
</style>