import { Formik, Form, Field, ErrorMessage } from "formik";
import css from "./SearchBar.module.css";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar({ onSubmit }) {
  return (
    <Formik
      initialValues={{ query: "" }}
      onSubmit={(values, actions) => {
        const q = values.query.trim();
        onSubmit(q);
        console.log(q);
        actions.resetForm();
      }}
    >
      <header className={css.headerSearchBar}>
        <Form className={css.form}>
          <button type="submit" className={css.buttonSearchBar}>
            <AiOutlineSearch size="26px" />
          </button>
          <Field
            name="query"
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </Form>
      </header>
    </Formik>
  );
}

export default SearchBar;
