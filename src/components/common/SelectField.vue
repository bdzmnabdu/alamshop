<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { useForm } from "vee-validate";
import { defineProps, defineEmits, reactive } from "vue";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import FormControl from "../ui/form/FormControl.vue";

const props = defineProps<{
  selectVal: string | undefined;
  data: any;
  formSchema: any;
}>();
defineEmits(["update:selectVal"]);

const state = reactive({
  searchVal: "",
});
console.log(state.searchVal);

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
            placeholder="e.g. 129003849"
            role="combobox"
            :class="cn('justify-between h-9')"
            :value="
              values.hscode
                ? data.find((hsc: any) => hsc.code === values.hscode)
                    ?.code
                : 'Select HS Code...'
            "
          />
          <ChevronsUpDown
            class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2 top-2.5"
          />
        </div>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command>
        <FormControl>
          <CommandInput placeholder="Search HS Code..." @input="handleInput" />
        </FormControl>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <ScrollArea class="h-40">
              <CommandItem
                v-for="(hsc, index) in data"
                :key="index"
                :value="hsc.code"
                @select="
                  () => {
                    setFieldValue('hscode', hsc.code);
                    $emit('update:selectVal', hsc.code);
                  }
                "
              >
                <Check
                  :class="
                    cn(
                      'mr-2 h-4 w-4',
                      hsc.code === values.hscode ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
                {{ hsc.code }}
              </CommandItem>
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
