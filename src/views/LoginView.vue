<template>
  <main>
    <div class="card text-left" style="width: 40rem">
      <div class="card-header text-center">
        <h2>تسجيل دخول</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">الايميل</label>
            <input type="email" v-model="userData.email" class="form-control" id="email" autocomplete="off"
              placeholder="name@example.com" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">كلمة المرور </label>
            <input type="password" v-model="userData.password" class="form-control" id="password" autocomplete="off" />
          </div>
          <p class="text-danger">{{ error }}</p>
          <button v-if="!loading" class="btn btn-primary px-5" type="submit">
            دخول
          </button>
          <button v-else class="btn btn-primary px-5" disabled type="submit">
            دخول
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
  
<script setup>
import { ref } from "vue";
import useLogin from "@/composables/useLogin";
import { useRouter } from "vue-router";
const { login, error, loading } = useLogin();
const router = useRouter();
const userData = ref({
  email: "",
  password: "",
});
const handleSubmit = async () => {
  await login(userData.value);
  if (!error.value) {
    console.log("logged in sussefuly");
    let pathBeforeLogin = JSON.parse(sessionStorage.getItem("path"));
    if (pathBeforeLogin) {
      sessionStorage.removeItem("path")
      router.push({ name: pathBeforeLogin.name });
    } else {
      router.push({ name: "board" });
    }
  }

};
</script>
  
<style scoped>
main {
  background: linear-gradient(to right, #34e89e, #0f3443);

  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>