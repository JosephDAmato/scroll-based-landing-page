const modalContentWrapper = document.querySelector("#my_modal");
const modalMessageContentArea = document.querySelector("#message");
export function handleclose() {
  console.log("click");
  modalContentWrapper.style.display = "none";
  modalMessageContentArea.innerHTML = ``;
}

export function linkHandler() {
  const modalHTML = `
      <p>Stay tuned for content and updates!</p>
      <p style="text-align: left, font-size: 10px"> - February 21, 2025<p>
    `;
  modalMessageContentArea.innerHTML = modalHTML;
  modalContentWrapper.style.display = "block";
}
