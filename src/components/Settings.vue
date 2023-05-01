<template>
  <div v-if="board && players && sponcers">
    <div class="mt-3 ms-3">
      <h3>اعدادات النشرة</h3>

      <div class="my-3 d-flex justify-content-between align-items-end text-center">
        <label for="winner" class="form-label d-inline-block me-md-3 me-2 w-25">نص الفوز</label>
        <input type="text" class="form-control d-inline-block" name="winner" id="winner"
          placeholder="النص فوق اسم الفريق الفائز" v-model="board.winnerText" />
      </div>

      <input type="radio" class="btn-check" name="options-outlined" id="success-outlined" autocomplete="off"
        value="auto" v-model="board.namesControl" />
      <label class="btn btn-outline-success mx-md-3 ms-1 me-1" for="success-outlined">التحكم بالاسماء تلقائيا
      </label>

      <input type="radio" class="btn-check" name="options-outlined" id="danger-outlined" autocomplete="off"
        value="manual" v-model="board.namesControl" />
      <label class="btn btn-outline-danger" for="danger-outlined">التحكم بالاسماء يدويا
      </label>

      <div v-if="board.namesControl === 'manual'">
        <div class="
            m-3
            d-flex
            justify-content-between
            align-items-center
            text-center
          ">
          <label for="name" class="form-label d-inline-block me-md-3 w-25">اسم الفريق الاول</label>
          <input type="text" class="form-control d-inline-block" name="name" id="name" placeholder="اسم الفريق الاول"
            v-model="board.team1.manualName" required />
        </div>
        <div class="
            m-3
            d-flex
            justify-content-between
            align-items-center
            text-center
          ">
          <label for="name" class="form-label d-inline-block me-md-3 w-25">اسم الفريق الثانى</label>
          <input type="text" class="form-control d-inline-block" name="name" id="name" v-model="board.team2.manualName"
            placeholder="اسم الفريق الثانى" required />
        </div>
      </div>
    </div>
    <hr />
    <div class="mt-3 ms-3">
      <h3>اعدادات الممولين</h3>
      <div class="
          d-flex
          justify-content-around
          align-items-end
          flex-column flex-md-row
        ">
        <BoardSelect label="الممول علي يمين الشاشة" icon="bi-arrow-right-circle" :board="board" :options="sponcers"
          :options-array="sponcersArray" team="team1" model="sponcer" />
        <BoardSelect label="الممول علي يسار الشاشة" icon="bi-arrow-left-circle" :board="board" :options="sponcers"
          :options-array="sponcersArray" team="team2" model="sponcer" />
      </div>
    </div>
    <hr />
    <div class="mt-3 ms-3">
      <h3>اعدادات موقع عرض الصور</h3>
      <div class="d-flex justify-content-around">
        <label for="opacity" class="form-label d-inline-block">درجة الشفافية : {{ board.opacity }}</label>
        <input type="range" class="form-range d-inline-block" style="width: 50%" min="0" max="100" step="5"
          v-model="board.opacity" id="opacity" />
      </div>
    </div>
    <hr />
    <div class="text-center">
      <button class="btn btn-warning mt-1 px-5 mx-3" :disabled="loadingUpdates" @click.prevent="handleUpdate">
        تحديث
        <span v-if="loadingUpdates" class="spinner-border spinner-border-sm ms-3" role="status"
          aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import BoardSelect from "@/components/board/BoardSelect.vue";
import useDocument from "@/composables/useDocument";
const props = defineProps(["players", "sponcers", "board", "ENV", "records"]);
const namesControl = ref(null);
const {
  error: updatingError,
  isPending: loadingUpdates,
  updateDoc,
} = useDocument("board");

const sponcersArray = computed(() => {
  let result = null;
  if (props.sponcers) {
    result = [
      {
        id: null,
        name: "لا يوجد ممول",
      },
    ];
    for (let sponcerId in props.sponcers) {
      result.push(props.sponcers[sponcerId]);
    }
  }
  return result;
});

onBeforeUnmount(async () => {
  await updateDoc(props.ENV, props.board);
});

const handleUpdate = async () => {
  await updateDoc(props.ENV, props.board);
};
</script>

<style>

</style>