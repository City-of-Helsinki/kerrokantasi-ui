const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      resolve(event.target.result);
    };

    fileReader.onerror = (event) => {
      const error = event instanceof Error ? event : fileReader.error;
      reject(
        error instanceof Error
          ? error
          : new Error('Failed to read file as data URI')
      );
    };

    fileReader.readAsDataURL(file);
  });

export default fileToDataUri;
