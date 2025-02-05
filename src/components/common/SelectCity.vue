<script setup lang="ts">
import { useForm } from "vee-validate";
import { reactive, defineEmits, defineProps } from "vue";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCities from "../../composables/useCities";

const props = defineProps<{
  selectVal: string | undefined;
  formSchema: any;
}>();
defineEmits(["update:selectVal"]);

const state = reactive({
  searchVal: "",
});

const { cities } = useCities();

const { setFieldValue, values } = useForm({
  validationSchema: props.formSchema,
});

function handleInput(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  state.searchVal = target.value;
  console.log("Input value changed:", state.searchVal);
}
</script>
<template>
  <Popover>
    <PopoverTrigger as-child>
      <FormControl>
        <div class="relative">
          <Input
            type="text"
            placeholder="e.g. Jakarta - Halim Perdana Kusuma - HLP"
            role="combobox"
            :class="cn('justify-between h-9')"
            :value="
                values.cityFrom
                  ? cities.find((cty: any) => cty.city === values.cityFrom)
                      ?.city
                  : 'Select City...'
              "
          />
          <ChevronsUpDown
            class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2 top-2.5"
          />
        </div>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent class="w-[400px] p-0" align="start">
      <Command>
        <CommandInput placeholder="Search City..." @input="handleInput" />

        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <ScrollArea class="h-40">
              <CommandItem
                v-for="(cty, index) in cities"
                :key="index"
                :value="cty.city"
                @select="
                  () => {
                    setFieldValue('cityFrom', cty.city);
                    $emit('update:selectVal', cty.city);
                  }
                "
              >
                <Check
                  :class="
                    cn(
                      'mr-2 h-4 w-4',
                      cty.city === values.cityFrom ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
                {{ cty.city }}
              </CommandItem>
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
