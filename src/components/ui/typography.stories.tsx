import type { Meta, StoryObj } from "@storybook/react";
import {
  H1,
  H2,
  H3,
  H4,
  Paragraph as Paragraph_,
  Blockquote as Blockquote_,
  InlineCode as InlineCode_,
  Lead as Lead_,
  Large as Large_,
  Small as Small_,
  Muted as Muted_,
  typography,
} from "./typography";

function TypographyDemo({ children }: React.PropsWithChildren) {
  return <div className="container flex w-full justify-center">{children}</div>;
}

const meta = {
  title: "Components/UI/Typography",
  component: TypographyDemo,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TypographyDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    children: <H1>Taxing Laughter: The Joke Tax Chronicles</H1>,
  },
};

export const Heading2: Story = {
  args: {
    children: <H2>Taxing Laughter: The Joke Tax Chronicles</H2>,
  },
};

export const Heading3: Story = {
  args: {
    children: <H3>The Joke Tax</H3>,
  },
};

export const Heading4: Story = {
  args: {
    children: <H4>People stopped telling jokes</H4>,
  },
};

export const Paragraph: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Paragraph_>
          The king thought long and hard, and finally came up with{" "}
          <a href="#a11y" className={typography.link}>
            a brilliant plan
          </a>
          : he would tax the jokes in the kingdom.
        </Paragraph_>
        <Paragraph_ className="mt-4">
          As a result, people stopped telling jokes, and the kingdom fell into a
          gloom. But there was one person who refused to let the king&apos;s
          foolishness get him down: a court jester named Jokester.
        </Paragraph_>
      </div>
    ),
  },
};

export const Lead: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Paragraph_>
          <Lead_>
            A modal dialog that interrupts the user with important content and
            expects a response.
          </Lead_>
        </Paragraph_>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Paragraph_>
          <Large_>Are you absolutely sure?</Large_>
        </Paragraph_>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Paragraph_>
          <Small_>Email address</Small_>
        </Paragraph_>
      </div>
    ),
  },
};

export const Muted: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Paragraph_>
          <Muted_>Enter your email address</Muted_>
        </Paragraph_>
      </div>
    ),
  },
};

export const Blockquote: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-lg">
        <Blockquote_>{`"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."`}</Blockquote_>
      </div>
    ),
  },
};

export const InlineCode: Story = {
  args: {
    children: <InlineCode_>{"@radix-ui/react-alert-dialog"}</InlineCode_>,
  },
};
