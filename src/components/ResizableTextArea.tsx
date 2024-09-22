"use client";

import { FormEvent, useCallback, useEffect, useRef } from "react";

const ResizableTextArea = ({
  onInput,
  onSubmit,
  ...props
}: {
  onInput: (input: FormEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${Math.min(
          textAreaRef.current.scrollHeight,
          10 * 16
        )}px`;
        onInput(event);
      }
    },
    [onInput]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    handleInput({
      currentTarget: textAreaRef.current,
    } as React.FormEvent<HTMLTextAreaElement>);
  }, [handleInput]);

  return (
    <textarea
      ref={textAreaRef}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      style={{
        maxHeight: "10rem",
        padding: "10px",
        lineHeight: "1.5",
        resize: "none",
      }}
      className={`w-full block border-0 bg-transparent outline-none overflow-auto ${props.className}`}
      {...props}
    />
  );
};

export default ResizableTextArea;
