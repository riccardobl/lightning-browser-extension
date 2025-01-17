import Button from "@components/Button";
import TextField from "@components/form/TextField";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import utils from "~/common/lib/utils";
import i18n from "~/i18n/i18nConfig";
import { welcomeI18nNamespace } from "~/i18n/namespaces";

const initialFormData = {
  password: "",
  passwordConfirmation: "",
};

const initialErrors = {
  password: "",
  passwordConfirmation: "",
};

export default function SetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const { t } = useTranslation(["welcome"]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });

    if (event.target.name === "password" && errors.password) {
      setErrors({ ...errors, password: "" });
    } else if (
      event.target.name === "passwordConfirmation" &&
      errors.passwordConfirmation &&
      formData.password === event.target.value.trim()
    ) {
      setErrors({ ...errors, passwordConfirmation: "" });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await utils.call("setPassword", { password: formData.password });
      navigate("/choose-connector");
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }

  function validate() {
    let password = "";
    let passwordConfirmation = "";

    if (!formData.password)
      password = i18n.t("set_password.enter_password", welcomeI18nNamespace);
    if (!formData.passwordConfirmation) {
      passwordConfirmation = i18n.t(
        "set_password.confirm_password",
        welcomeI18nNamespace
      );
    } else if (formData.password !== formData.passwordConfirmation) {
      passwordConfirmation = i18n.t(
        "set_password.mismatched_password",
        welcomeI18nNamespace
      );
    }
    setErrors({
      password,
      passwordConfirmation,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative mt-14 lg:flex space-x-8 bg-white dark:bg-surface-02dp py-12 px-10">
        <div className="lg:w-1/2">
          <h1 className="text-2xl font-bold dark:text-white">
            {t("set_password.title")}
          </h1>
          <p className="text-gray-500 mt-6 dark:text-neutral-400">
            {t("set_password.description")}
          </p>
          <div className="w-4/5">
            <div className="mt-6">
              <TextField
                id="password"
                label={t("set_password.choose_password_label")}
                type="password"
                autoFocus
                required
                onChange={handleChange}
              />
              {errors.password && (
                <div className="mt-1 text-red-500">{errors.password}</div>
              )}
            </div>
            <div className="mt-6">
              <TextField
                id="passwordConfirmation"
                label={t("set_password.confirm_password_label")}
                type="password"
                required
                onChange={handleChange}
                onBlur={validate}
              />
              {errors.passwordConfirmation && (
                <div className="mt-1 text-red-500">
                  {errors.passwordConfirmation}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 lg:mt-0 lg:w-1/2">
          <div className="lg:flex h-full justify-center items-center">
            <img src="assets/icons/satsymbol.svg" alt="sats" className="w-64" />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          label="Next"
          type="submit"
          primary
          disabled={
            !formData.password ||
            formData.password !== formData.passwordConfirmation
          }
        />
      </div>
    </form>
  );
}
