import { ref } from "vue";
import { projectFirestore } from "@/firebase/config";

const useCollection = (collection) => {
  const error = ref(null);
  const loading = ref(false);
  const addDoc = async (document) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await projectFirestore.collection(collection).add(document);
      loading.value = false;
      error.value = null;
      return res;
    } catch (err) {
      console.log(err);
      loading.value = false;
      error.value = "Can't save player. please, try again later !";
    }
  };
  return { error, loading, addDoc };
};

export default useCollection;
