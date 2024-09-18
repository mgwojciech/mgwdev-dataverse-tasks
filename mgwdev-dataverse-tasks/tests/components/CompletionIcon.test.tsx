import { vi, expect } from "vitest";
import * as React from "react";
import { CompletionIcon, ICompletionIconProps } from "../../src/components/CompletionIcon";
import { render } from "@testing-library/react";

describe("CompletionIcon", () => {
    test("should render completion icon (0%)", () => {
        const props: ICompletionIconProps = {
            percentComplete: 0
        };
        const { container } = render(<CompletionIcon {...props} />);
        expect(container).toMatchSnapshot();
    });
    test("should render completion icon (50%)", () => {
        const props: ICompletionIconProps = {
            percentComplete: 50
        };
        const { container } = render(<CompletionIcon {...props} />);
        expect(container).toMatchSnapshot();
    });
    test("should render completion icon (100%)", () => {
        const props: ICompletionIconProps = {
            percentComplete: 100
        };
        const { container } = render(<CompletionIcon {...props} />);
        expect(container).toMatchSnapshot();
    });
});