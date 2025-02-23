const modalContentWrapper = document.querySelector("#my_modal");
let modalMessageContentArea = document.querySelector("#message");
modalMessageContentArea.innerHTML = null;
export function handleclose() {
  console.log("click");
  modalContentWrapper.style.display = "none";
  modalMessageContentArea.innerHTML = null;
}

export function linkHandler(e) {
  if (modalMessageContentArea.innerHTML) {
    modalMessageContentArea.innerHTML = null;
  }
  const dataValue = e.target.getAttribute("data-value");
  console.log(dataValue);
  const defaultModalHTML = `
     <p>Stay tuned for content and updates!</p>
    <p style="text-align: left; font-size: 10px"> - February 21, 2025</p>
      `;
  const projectLinksHTML = `
    <div class="link_tree_list wrapper">
      <ul class="link_tree_list list">
        <li class="link_tree_list item">🤬Tutorial Hell🔥</li>
        <li class="link_tree_list item">Squirrels❗</li>
        <li class="link_tree_list item">THREEjs Projects📐</li>
      </ul>
    </div>
  `;
  if (dataValue == "portfolio") {
    modalMessageContentArea.innerHTML = projectLinksHTML;
  } else {
    modalMessageContentArea.innerHTML = defaultModalHTML;
  }
  modalContentWrapper.style.display = "block";
}
