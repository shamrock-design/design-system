import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { FileDropzone } from "./FileDropzone";

const meta = {
  title: "Components/FileDropzone",
  component: FileDropzone,
  args: {
    accept: ".xlsx",
  },
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ maxWidth: 480 }}>
        <FileDropzone
          {...args}
          selectedFiles={files}
          onFiles={(f) => setFiles((prev) => [...prev, ...f])}
          onRemove={(_, index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
        />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([
      new File(["x".repeat(2048)], "L0-master-config.xlsx"),
      new File(["y".repeat(1_600_000)], "planning-areas-EMEA.xlsx"),
    ]);
    return (
      <Stack gap={8} style={{ maxWidth: 480 }}>
        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            Default
          </Text>
          <FileDropzone accept=".xlsx" onFiles={() => undefined} />
        </Stack>

        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            Multiple + selected file chips
          </Text>
          <FileDropzone
            accept=".xlsx"
            multiple
            selectedFiles={files}
            onFiles={(f) => setFiles((prev) => [...prev, ...f])}
            onRemove={(_, index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
          />
        </Stack>

        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            With size limit
          </Text>
          <FileDropzone accept=".xlsx" maxBytes={1024 * 1024} onFiles={() => undefined} />
        </Stack>

        <Stack gap={2}>
          <Text variant="label-caps" tone="subtle">
            Disabled with reason
          </Text>
          <FileDropzone
            accept=".xlsx"
            disabled
            disabledReason="Select an L0 stage above to enable upload"
          />
        </Stack>
      </Stack>
    );
  },
};
