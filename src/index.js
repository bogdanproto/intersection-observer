import { pixabayApi } from './js/api-service';
import { MarkUpInterface } from './js/interface-service';

let totalImg = 0; //saved value "how many img founded"

const ref = {
  form: '.search-form',
  gallery: '.gallery',
  buttonMore: '.load-more',
};

const interFace = new MarkUpInterface(ref);

interFace.form.addEventListener('submit', onShowResult);

//First download images
function onShowResult(evt) {
  evt.preventDefault();
  interFace.clearGallery();

  const { searchQuery } = evt.currentTarget.elements;

  if (!searchQuery.value) {
    interFace.showNotification('notFound');
    return;
  }
  pixabayApi
    .fetchImages(searchQuery.value)
    .then(data => {
      const { totalHits, hits } = data;
      totalImg = totalHits;

      if (!totalHits) {
        interFace.showNotification('notFound');
      } else {
        interFace.markUpGallery(hits);
        interFace.showNotification('foundedImages', totalHits);
        interFace.onInfinityScroll(loadMorelResult);
        totalImg -= hits.length;
      }
    })
    .catch(error => console.log(error));
}

//next download images
function loadMorelResult(evt) {
  if (evt[0].intersectionRatio > 0) {
    pixabayApi
      .fetchMoreImages()
      .then(data => {
        const { hits } = data;

        interFace.markUpGallery(hits);
        interFace.smoothScroll();
        totalImg -= hits.length;

        if (!totalImg) {
          interFace.showNotification('notMoreImages');
        }
      })
      .catch(error => console.log(error));
  }
}

// //switchOn or switchOff infinite scroll
// function switchInfiniteScroll(evt) {
//   const { checked } = evt.currentTarget;

//   if (checked) {
//     interFace.hiddenButtonLoadMore();
//     interFace.onListenerScroll(loadMorelResult);
//   } else {
//     interFace.offListenerScroll();
//     if (totalImg) {
//       interFace.showButtonLoadMore();
//     }
//   }
// }
