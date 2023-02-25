import React, { useState } from "react";

// Components
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";

// Icons
import { Plus, X } from "lucide-react";

const CreateGuest = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[parseInt(name)] = value;
      return newOptions;
    });
  };

  const handleAddOption = () => {
    if (options.length >= 10) {
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

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="w-4/5 text-center text-3xl font-semibold text-gray-900">
        Elevate your polling game with Superpolls - the app that creates
        beautiful and engaging polls in minutes.
      </h1>
      <div className="mt-10 w-full max-w-xl rounded-xl bg-gray-50 p-10">
        <div className="flex flex-col items-center">
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
                Icon={options.length > 2 && <X className="stroke-gray-400" />}
                IconButtonOnClick={() => handleDeleteOption(index)}
              />
            ))}
            <Button
              classes="w-full border"
              type="secondary"
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </div>
          <Button
            classes="w-full mt-10 justify-center"
            type="primary"
            Icon={Plus}
          >
            Create Poll
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGuest;
