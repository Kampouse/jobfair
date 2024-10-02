import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getUsers } from "~/api/endpoint";
import { routeLoader$ } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";
import { castVote } from "~/api/endpoint";
import { useStore, $ } from "@builder.io/qwik";
import { useOnWindow } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import {
  createJobStand,
  getJobStands,
  updateJobStand,
  deleteJobStand,
} from "~/api/endpoint";
export const useJobStands = routeLoader$(async () => {
  return await getJobStands({ limit: 10, offset: 0 });
});

export const createJobStandServer = server$(
  async (standData: {
    standNumber: number;
    companyName: string;
    positionType: string;
    viability: string;
  }) => {
    return await createJobStand(
      standData.standNumber,
      standData.companyName,
      standData.positionType,
      standData.viability,
    );
  },
);

export const updateJobStandServer = server$(
  async (
    standId: number,
    updateData: Partial<{
      standNumber: number;
      companyName: string;
      positionType: string;
      viability: string;
    }>,
  ) => {
    return await updateJobStand(standId, updateData);
  },
);

export const deleteJobStandServer = server$(async (standId: number) => {
  return await deleteJobStand(standId);
});

export default component$(() => {
  const jobStandsData = useJobStands();

  const jobStands = useStore(jobStandsData.value);
  const newStand = useStore({
    standNumber: 0,
    companyName: "",
    positionType: "",
    viability: "",
  });
  const editingStand = useSignal<number | null>(null);

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="mb-6 text-3xl font-bold">Job Stands Management</h1>

      {/* Add new stand form */}
      <div class="mb-8 rounded-lg bg-gray-100 p-4">
        <h2 class="mb-4 text-xl font-semibold">Add New Stand</h2>
        <form
          preventdefault:submit
          onSubmit$={async (e) => {
            const form = e.target as HTMLFormElement;
            if (form.checkValidity()) {
              const result = await createJobStandServer(newStand);
              if (result.success) {
                console.log(result.stand);
                jobStands.push(result.stand[0]);
                newStand.standNumber = 0;
                newStand.companyName = "";
                newStand.positionType = "";
                newStand.viability = "";
              } else {
                alert(result.message || "Failed to create job stand");
              }
            } else {
              form.reportValidity();
            }
          }}
        >
          <input
            type="number"
            placeholder="Stand Number"
            value={newStand.standNumber}
            onInput$={(e) =>
              (newStand.standNumber = parseInt(
                (e.target as HTMLInputElement).value,
              ))
            }
            class="mb-2 w-full p-2"
            required
            min="1"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={newStand.companyName}
            onInput$={(e) =>
              (newStand.companyName = (e.target as HTMLInputElement).value)
            }
            class="mb-2 w-full p-2"
            required
            minLength="2"
            maxLength="100"
          />
          <input
            type="text"
            placeholder="Position Type"
            value={newStand.positionType}
            onInput$={(e) =>
              (newStand.positionType = (e.target as HTMLInputElement).value)
            }
            class="mb-2 w-full p-2"
            required
            minLength="2"
            maxLength="50"
          />
          <input
            type="text"
            placeholder="Viability"
            value={newStand.viability}
            onInput$={(e) =>
              (newStand.viability = (e.target as HTMLInputElement).value)
            }
            class="mb-2 w-full p-2"
            required
            minLength="1"
            maxLength="50"
          />
          <button type="submit" class="rounded bg-blue-500 p-2 text-white">
            Add Stand
          </button>
        </form>
      </div>

      {/* Job Stands List */}
      <div class="grid gap-4">
        {jobStands.map((stand) => (
          <div
            key={stand.id}
            class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {editingStand.value === stand.id ? (
              <form
                preventdefault:submit
                onSubmit$={async (e) => {
                  const form = e.target as HTMLFormElement;
                  if (form.checkValidity()) {
                    const result = await updateJobStandServer(stand.id, {
                      standNumber: stand.standNumber,
                      companyName: stand.companyName,
                      positionType: stand.positionType,
                    });
                    if (result.success) {
                      editingStand.value = null;
                    }
                  } else {
                    form.reportValidity();
                  }
                }}
                class="w-full rounded-lg bg-gray-100 p-4 shadow-md"
              >
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-bold" for="standNumber">
                    Stand Number
                  </label>
                  <input
                    id="standNumber"
                    type="number"
                    value={stand.standNumber}
                    onInput$={(e) =>
                      (stand.standNumber = parseInt(
                        (e.target as HTMLInputElement).value,
                      ))
                    }
                    class="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-bold" for="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={stand.companyName}
                    onInput$={(e) =>
                      (stand.companyName = (e.target as HTMLInputElement).value)
                    }
                    class="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    class="mb-2 block text-sm font-bold"
                    for="positionType"
                  >
                    Position Type
                  </label>
                  <input
                    id="positionType"
                    type="text"
                    value={stand.positionType}
                    onInput$={(e) =>
                      (stand.positionType = (
                        e.target as HTMLInputElement
                      ).value)
                    }
                    class="w-full rounded border border-gray-300 p-2"
                    required
                  />
                  <div class="mb-4">
                    <label class="mb-2 block text-sm font-bold" for="viability">
                      Viability
                    </label>
                    <input
                      id="viability"
                      type="text"
                      value={stand.viable}
                      onInput$={(e) =>
                        (stand.viable = (e.target as HTMLInputElement).value)
                      }
                      class="w-full rounded border border-gray-300 p-2"
                      required
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="mr-2 rounded bg-green-500 p-2 text-white transition-colors hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick$={() => (editingStand.value = null)}
                    class="rounded bg-gray-500 p-2 text-white transition-colors hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div class="flex flex-col">
                  <h2 class="mb-2 text-2xl font-bold text-blue-600">
                    {stand.companyName}
                  </h2>
                  <div class="flex flex-col space-y-1">
                    <p class="text-gray-700">
                      <span class="font-semibold">Stand Number:</span>
                      <span class="ml-2 rounded bg-gray-200 px-2 py-1">
                        {stand.standNumber}
                      </span>
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Position:</span>
                      <span class="ml-2 italic">{stand.positionType}</span>
                    </p>
                    <p class="text-gray-700">
                      <span class="font-semibold">Viability:</span>
                      <span
                        class={`ml-2 rounded px-2 py-1 ${stand.viable === "High" ? "bg-green-200 text-green-800" : stand.viable === "Medium" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
                      >
                        {stand.viable}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick$={() => (editingStand.value = stand.id)}
                    class="mr-2 rounded bg-yellow-500 p-2 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick$={async () => {
                      const result = await deleteJobStandServer(stand.id);
                      if (result.success) {
                        jobStands.splice(jobStands.indexOf(stand), 1);
                      }
                    }}
                    class="rounded bg-red-500 p-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
