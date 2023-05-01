import { projectStorage } from "@/firebase/config";
import { ref } from "vue";
const useStorage = () => {
  const error = ref(null);
  const loading = ref(false);
  const url = ref(null);
  const filePath = ref(null);
  const uploadFile = async (username, file) => {
    error.value = null;
    loading.value = true;
    let unique = new Date().toJSON().replace(/:/g, "");
    filePath.value = `photos/${username}/(${unique})-(${file.name})`;
    const storageRef = projectStorage.ref(filePath.value);
    try {
      const res = await storageRef.put(file);
      url.value = await res.ref.getDownloadURL();
      error.value = null;
      loading.value = false;
    } catch (err) {
      console.log(err);
      error.value = "Can't Upload this Image";
      loading.value = false;
    }
  };
  const deleteImage = async (path) => {
    loading.value = false;
    error.value = null;
    const storageRef = projectStorage.ref(path);
    try {
      loading.value = true;
      const res = await storageRef.delete();
      loading.value = false;
      error.value = null;
      return res;
    } catch (err) {
      loading.value = false;
      console.log(err.message);
      error.value = "Can't delete the file";
    }
  };
  return { error, loading, uploadFile, filePath, url, deleteImage };
};
export default useStorage;
