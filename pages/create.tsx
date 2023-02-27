import React, { useState } from "react";
import { api } from "@/lib/trpc";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// Components
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";

// Icons
import { Loader2, Plus, X } from "lucide-react";

const CreateGuest = () => {
  const router = useRouter();
  const mutation = api.polls.createPoll.useMutation();

  // State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[parseInt(name)] = value;
      return newOptions;
    });
  };

  const handleAddOption = () => {
    if (options.length >= 5) {
      toast.error("You can only add up to 5 options, please login to add more");
      return;
    }
    setOptions((prevOptions) => [...prevOptions, ""]);
  };

  const handleDeleteOption = (index: number) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      return newOptions;
    });
  };

  const createPoll = () => {
    const filteredOptions = options.filter((option) => option !== "");
    if (filteredOptions.length >= 2 && question.length > 0) {
      mutation.mutate({
        name: question,
        options: filteredOptions,
      });
    } else {
      toast.error("Please enter a question and at least 2 options");
    }
  };

  if (mutation.isSuccess) {
    toast.success("Poll created successfully!");
    router.push(`/polls/${mutation.data.id}`);
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="w-4/5 text-center text-3xl font-semibold text-gray-900">
        Elevate your polling game with Superpolls - the app that creates
        beautiful and engaging polls in minutes.
      </h1>
      <div className="mt-10 w-full max-w-xl rounded-xl bg-gray-50 p-10">
        {mutation.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-y-2">
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl font-semibold">Creating Poll</h2>
              <Loader2 className="animate-spin" />
            </div>
            <p className="text-center text-gray-500">
              You will be redirected to the poll, once the poll is created.
              <br />
              please be patient.
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center ${
              mutation.isLoading && "cursor-wait opacity-50"
            }`}
          >
            <CustomInput
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              type="text"
              placeholder="What's your question?"
            />

            <div className="w- mt-10 flex w-full flex-col gap-y-6">
              {options.map((option, index) => (
                <CustomInput
                  name={index.toString()}
                  onChange={handleChange}
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  Icon={
                    options.length > 2 && (
                      <X className="stroke-gray-400 hover:stroke-gray-600" />
                    )
                  }
                  IconButtonOnClick={() => handleDeleteOption(index)}
                />
              ))}
              <Button
                classes="w-full border"
                type="secondary"
                onClick={handleAddOption}
                Icon={Plus}
              >
                Add another option
              </Button>
            </div>
            <Button
              onClick={createPoll}
              classes="w-full mt-10 justify-center"
              type="primary"
              disabled={mutation.isLoading}
            >
              Create Poll
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGuest;
