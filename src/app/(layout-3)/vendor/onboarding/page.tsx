import MultiStepForm from "lib/useMultistep";
import { FormProvider } from "@context/formcontext";
const Onboarding = () => {
  return (
    <section className="flex justify-between items-center mx-auto">
      <div className="w-1/2 h-screen bg-yellow-300 flex place-items-center mx-auto p-3">
        <h1 className="lg:text-8xl md:text-6xl sm:text-4xl xs:text-lg text-white">
          Onboarding
        </h1>
      </div>
      <div className="w-1/2 h-screen flex place-items-center">
        <FormProvider>
          <MultiStepForm />
        </FormProvider>
      </div>
    </section>
  );
};

export default Onboarding;
