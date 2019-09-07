function change() {
	alert(document.getElementById('schalter').src)
	document.getElementById('schalter').src='/images/Schalter2.png';
	}



function check_pin() {alert('kommt auch noch')}




/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggle_selection1() {
  document.getElementById("myDropdown1").classList.toggle("show");
}

function toggle_selection2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}



// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


