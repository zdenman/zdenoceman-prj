// $ = jQuery.noConflict();
// $(document).ready(() => {
//   const imageContainer = $('#zdeno-gallery');

//   // Fetch filenames from the server
//   $.getJSON(`${theme_vars.theme_url}/photos/photos.json`)
//     .done(filenames => {
//       filenames.forEach(fileName => {
//         const imgAnchor = $('<a>');
//         imgAnchor.attr('href', `${theme_vars.theme_url}/photos/${fileName}`);
        
//         const imgElement = $('<img>');
//         imgElement.attr('src', `${theme_vars.theme_url}/thumb/${fileName.replace('.jpg', '.webp')}`);
          
//           const title = fileName.replace('.jpg', '');
//           imgElement.attr('alt', title);
          
//           imgAnchor.append(imgElement);
//           imageContainer.append(imgAnchor);
//         });

//         // Add lazy class to the thumnails
//         $('.justified-gallery img').addClass('lazy');
       

//         // Initialize Justified Gallery and Colorbox
//         imageContainer.justifiedGallery({
//           rowHeight: 300,
//           margins: 10,
//           randomize: true,
//           lastRow: 'hide',
//           waitThumbnailsLoad: false,
//           rel: 'gallery', // replace with 'gallery1' the rel attribute of each link
//         }).on('jg.complete', function () {
//           $(this).find('a').colorbox({
//             maxWidth: '90%',
//             maxHeight: '90%',
//             opacity: 0.9,
//             transition: 'elastic',
//             current: ''
//           });
//         });

//         // Simple lazy loading
//       $('.lazy').each(function () {
//         $(this).attr('loading', 'lazy');
//       });

//       })
//       .fail(error => console.error('Error fetching filenames:', error));
//       // -------------------------------------------------------
  
      
//   });
  


$ = jQuery.noConflict();

$(document).ready(() => {
  const imageContainer = $('#zdeno-gallery');

  // Fetch filenames from the server
  $.getJSON(`${theme_vars.theme_url}/photos/photos.json`)
    .done(filenames => {
      filenames.forEach(fileName => {
        // Define imgAnchor within the loop scope
        const imgAnchor = $('<a>'); // Create anchor element
        imgAnchor.attr('href', `${theme_vars.theme_url}/photos/${fileName}`);

        const imgElement = $('<img>');
        imgElement.attr('src', `${theme_vars.theme_url}/thumb/${fileName.replace('.jpg', '.webp')}`);

        const title = fileName.replace('.jpg', '');
        imgElement.attr('alt', title);

        imgAnchor.append(imgElement);
        imageContainer.append(imgAnchor);

        // Add lazy class to the anchor element
        imgAnchor.addClass('lazy');
      });

      // Initialize Justified Gallery and Colorbox
      imageContainer.justifiedGallery({
        rowHeight: 300,
        margins: 10,
        randomize: true,
        lastRow: 'hide',
        waitThumbnailsLoad: false,
        rel: 'gallery', // replace with 'gallery1' the rel attribute of each link
      }).on('jg.complete', function () {
        $(this).find('a').colorbox({
          maxWidth: '90%',
          maxHeight: '90%',
          opacity: 0.9,
          transition: 'elastic',
          current: ''
        });
      });

      // Simple lazy loading
      $('.lazy').each(function () {
        $(this).attr('loading', 'lazy');
      });

    })
    .fail(error => console.error('Error fetching filenames:', error));
});
