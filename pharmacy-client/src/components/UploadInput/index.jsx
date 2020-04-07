import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  prescriptionInput: {
    display: "none",
  },
}));

export default ({ label, inputProps, multiple, onChange }) => {
  const classes = useStyles();

  const onInputChange = (files) => {
    if (typeof onChange === "function") {
      onChange(files);
    }
  };
  return (
    <>
      <input
        className={classes.prescriptionInput}
        multiple={multiple}
        type="file"
        onChange={(e) => onInputChange(e.currentTarget.files)}
        {...inputProps}
      />
      <label htmlFor={inputProps.id}>
        <Button variant="contained" color="primary" component="span">
          {label}
        </Button>
      </label>
    </>
  );
};
