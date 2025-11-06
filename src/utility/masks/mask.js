
import { onMounted } from "vue";
import IMask from "imask";

export function useMask(refInput, maskOptions) {
  onMounted(() => {
    if (refInput.value) {
      IMask(refInput.value, maskOptions);
    }
  });
}
