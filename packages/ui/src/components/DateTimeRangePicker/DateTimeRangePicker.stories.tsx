import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "../../index";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import { Calendar } from "./Calendar";
import type { DateTimeRange, RangeStepper } from "./rangeUtils";

const initial: DateTimeRange = {
  from: new Date(2026, 6, 6, 13, 0),
  to: new Date(2026, 6, 20, 13, 0),
};

const meta = {
  title: "Components/DateTimeRangePicker",
  component: DateTimeRangePicker,
  args: {
    value: initial,
    onChange: () => undefined,
  },
} satisfies Meta<typeof DateTimeRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(props: Partial<ComponentProps<typeof DateTimeRangePicker>>) {
  const [value, setValue] = useState<DateTimeRange>(props.value ?? initial);
  return (
    <Stack gap={3}>
      <DateTimeRangePicker {...props} value={value} onChange={setValue} />
      <Text variant="machine" tone="tertiary">
        from: {value.from ? value.from.toISOString() : "null"} · to: {value.to ? value.to.toISOString() : "null"}
      </Text>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          sizes
        </Text>
        <Controlled size="sm" />
        <Controlled size="md" />
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          with time (HH:mm, 24-hour)
        </Text>
        <Controlled showTime />
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          steppers — day / week / cycle
        </Text>
        {(["day", "week", "cycle"] as RangeStepper[]).map((stepper) => (
          <Controlled key={stepper} stepper={stepper} />
        ))}
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          bounded (min May 1 / max Aug 31, 2026)
        </Text>
        <Controlled min={new Date(2026, 4, 1)} max={new Date(2026, 7, 31)} />
      </Stack>

      <Stack gap={2}>
        <Text variant="label-caps" tone="subtle">
          empty & disabled
        </Text>
        <Controlled value={{ from: null, to: null }} />
        <Controlled disabled />
      </Stack>
    </Stack>
  ),
};

export const StandaloneCalendar: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<DateTimeRange>(initial);
      return <Calendar value={value} onChange={setValue} showTime />;
    }
    return <Demo />;
  },
};
