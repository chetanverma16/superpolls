import React, { useState } from "react";
import { api } from "@/lib/trpc";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

// Components
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Tooltip from "@/components/Tooltip";
import Textarea from "@/components/Textarea";

// Icons
import { InfoIcon, Loader2, Plus, Wand2, X } from "lucide-react";
import Head from "next/head";

const Create = () => {
  const router = useRouter();
  const mutation = api.polls.createPoll.useMutation();
  const { data: session } = useSession();
  const generateOptionMutation = api.ai.generatePollOptions.useMutation();

  // State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    if (session?.user) {
      if (session?.user?.stripeSubscriptionStatus === "active") {
        if (options.length >= 50) {
          toast.error(
            "You can only add up to 50 options, please contact support for more options",
          );
          return;
        }
        setOptions((prevOptions) => [...prevOptions, ""]);
        return;
      } else {
        if (options.length >= 6) {
          toast.error(
            "You can only add up to 6 options, upgrade to pro for more",
          );
          return;
        }
      }
    } else {
      if (options.length >= 3) {
        toast.error(
          "You can only add up to 3 options, please login to add more",
        );
        return;
      }
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
      const createPollPromise = mutation.mutateAsync(
        {
          name: question,
          options: filteredOptions,
          userId: session?.user.id,
          isPublic,
          isLive,
          isAuthenticated,
        },
        {
          onSuccess: (data) => {
            router.push(`/poll/${data.id}`);
          },
        },
      );
      toast.promise(createPollPromise, {
        loading: "Creating Poll",
        success: "Poll created successfully!",
        error: "Error creating poll",
      });
    } else {
      toast.error("Please enter a question and at least 2 options");
    }
  };

  const genearateOptions = async () => {
    if (session?.user?.stripeSubscriptionStatus !== "active") {
      toast.error("You need to be a pro user to use this feature");
      return;
    }
    const response = await generateOptionMutation.mutateAsync(question);
    if (response) {
      console.log(response.choices[0].text);
      const options = response.choices[0].text
        .split(/\r?\n/)
        .filter((option: string) => option !== "");
      const newOptions = options.map((option: string) => option.trim());
      setOptions(newOptions);
    }
  };

  const isOptionsEmpty = options.every((option) => option === "");

  return (
    <>
      <Head>
        <title>Superpoll - Create free polls</title>
        <meta name="title" content="Superpoll - Create free polls" />
        <meta
          name="description"
          content="
        Discover the ultimate polling experience with our app's elegant interface! Create and share polls effortlessly, with advanced features like customizable templates, real-time results, and in-depth analytics. Engage your audience and gain valuable insights with beautiful polls. Try it now!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://superpoll.app/" />
        <meta property="og:title" content="Superpoll - Create free polls" />
        <meta
          property="og:description"
          content="Discover the ultimate polling experience with our app's elegant interface! Create and share polls effortlessly, with advanced features like customizable templates, real-time results, and in-depth analytics. Engage your audience and gain valuable insights with beautiful polls. Try it now!"
        />
        <meta property="og:image" content="/og.webp" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://superpoll.app/" />
        <meta
          property="twitter:title"
          content="Superpoll - Create free polls"
        />
        <meta
          property="twitter:description"
          content="Discover the ultimate polling experience with our app's elegant interface! Create and share polls effortlessly, with advanced features like customizable templates, real-time results, and in-depth analytics. Engage your audience and gain valuable insights with beautiful polls. Try it now!"
        />
        <meta property="twitter:image" content="/og.webp" />
      </Head>
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
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's your question?"
                Icon={
                  isOptionsEmpty &&
                  question.length > 10 && (
                    <Tooltip content="Generate options with ai">
                      <Button onClick={genearateOptions}>
                        <Wand2 />
                      </Button>
                    </Tooltip>
                  )
                }
              />
              {/* <CustomInput /> */}

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
                {session?.user.stripeSubscriptionStatus === "active" && (
                  <div className="flex flex-col items-center gap-y-4">
                    <div className="flex w-full items-center justify-between gap-x-4">
                      <div className="flex w-full items-center justify-center rounded-md bg-white p-4 shadow-md">
                        <Toggle checked={isPublic} onChange={setIsPublic} />{" "}
                        <Tooltip content="Show/Hide Your Results Publically">
                          <span className="ml-2 flex items-center">
                            Results Public{" "}
                            <InfoIcon className="h-4 text-gray-500" />{" "}
                          </span>
                        </Tooltip>
                      </div>
                      <div className="flex w-full items-center justify-center rounded-md bg-white p-4 shadow-md">
                        <Toggle checked={isLive} onChange={setIsLive} />{" "}
                        <Tooltip content="Show/Hide Your Poll">
                          <span className="ml-2 flex items-center">
                            Live <InfoIcon className="h-4 text-gray-500" />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-x-4">
                      <div className="flex w-full items-center justify-center rounded-md bg-white p-4 shadow-md">
                        <Toggle
                          checked={isAuthenticated}
                          onChange={setIsAuthenticated}
                        />{" "}
                        <Tooltip content="Authenticate user before voting">
                          <span className="ml-2 flex items-center">
                            Authenticated{" "}
                            <InfoIcon className="h-4 text-gray-500" />{" "}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
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
    </>
  );
};

export default Create;
