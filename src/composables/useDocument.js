import { ref } from "vue";
import { projectFirestore } from "@/firebase/config";

const useDocument = (collection) => {
  const error = ref(null);
  const isPending = ref(false);

  const deleteDoc = async (id) => {
    let docRef = projectFirestore.collection(collection).doc(id);

    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.delete();
      isPending.value = false;
      error.value = null;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "could not delete the document";
      console.log(err.message);
    }
  };

  const updateDoc = async (id, updates) => {
    let docRef = projectFirestore.collection(collection).doc(id);

    isPending.value = true;
    error.value = null;
    try {
      const res = await docRef.update(updates);
      isPending.value = false;
      error.value = null;
      return res;
    } catch (err) {
      isPending.value = false;
      error.value = "could not update the document";
      console.log(err.message);
    }
  };

  return {
    error,
    isPending,
    deleteDoc,
    updateDoc,
  };
};
export default useDocument;
