ClassicEditor
  .create(document.querySelector('#ckeditor'))
  .then(editor => {
    console.log(editor);

  })
  .catch(err => {
    console.error(err);
  });
