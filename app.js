let $breedChosen = $('select.breedChosen');
$breedChosen.change(function() {
  let id = $(this).children(":selected").attr("id");
  getDogByBreed(id)
});

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml16');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml16 .letter',
    translateY: [-100,0],
    easing: "easeOutExpo",
    duration: 1400,
    delay: (el, i) => 30 * i
  }).add({
    targets: '.ml16',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

function getBreeds() {
  ajax_get('https://api.thedogapi.com/v1/breeds?api_key=e4a15730-b39b-4c3a-86a9-3c55de9a18d8', function(data) {
    populateBreedsSelect(data)
  });
}

function populateBreedsSelect(breeds) {
  $breedChosen.empty().append(function() {
    let output = '';
    $.each(breeds, function(key, value) {
      output += '<option id="' + value.id + '">' + value.name + '</option>';
    });
    return output;
  });
}

function getDogByBreed(breed_id) {

  ajax_get('https://api.thedogapi.com/v1/images/search?api_key=e4a15730-b39b-4c3a-86a9-3c55de9a18d8?include_breed=1&breed_id=' + breed_id, function(data) {

    if (data.length == 0) {

      clearBreed();
      $("#breedDataTable").append("<tr><td>No Image for that Breed Yet</td></tr>");
    } else {

      displayBreed(data[0])
    }
  });
}

function clearBreed() {
  $('#breedImage').attr('src', "");
  $("#breedDataTable tr").remove();
}

function displayBreed(image) {
  $('#breedImage').attr('src', image.url);
  $("#breedDataTable tr").remove();

  let breedData = image.breeds[0]
  $.each(breedData, function(key, value) {

    if (key == 'weight' || key == 'height') value = value.imperial

    $("#breedDataTable").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
  });
}


function ajax_get(url, callback) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

getBreeds();
