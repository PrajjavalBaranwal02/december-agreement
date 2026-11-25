
const signTrigger = document.getElementById("signTrigger");
const signatureMark = document.getElementById("signatureMark");
const approvalSeal = document.getElementById("approvalSeal");
const signedDate = document.getElementById("signedDate");
const pendingNote = document.getElementById("pendingNote");
const belowActions = document.getElementById("belowActions");
const notificationStatus = document.getElementById("notificationStatus");
const toast = document.getElementById("toast");

const thinkAgainModal = document.getElementById("thinkAgainModal");
const yesImInBtn = document.getElementById("yesImInBtn");
const yesObviouslyBtn = document.getElementById("yesObviouslyBtn");
const notNowBtn = document.getElementById("notNowBtn");

let signedAt = null;
let signedPdfBase64 = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// OPEN THE THINK AGAIN POPUP
function openThinkAgainModal() {
  thinkAgainModal.classList.add("open");
  thinkAgainModal.setAttribute("aria-hidden", "false");
}

function closeThinkAgainModal() {
  thinkAgainModal.classList.remove("open");
  thinkAgainModal.setAttribute("aria-hidden", "true");
}

// REVIEW BUTTON
signTrigger.addEventListener("click", () => {
  if (signedAt) {
    showToast("This agreement has already been signed. ❤️");
    return;
  }

  openThinkAgainModal();
});

// DECLINE / NOT NOW
notNowBtn.addEventListener("click", closeThinkAgainModal);

thinkAgainModal.addEventListener("click", (e) => {
  if (e.target === thinkAgainModal) {
    closeThinkAgainModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeThinkAgainModal();
  }
});

// RIBBON CELEBRATION
function showRibbonCelebration() {
  const celebration = document.createElement("div");
  celebration.className = "ribbon-celebration";

  celebration.innerHTML = `
    <div class="celebration-icon">❤️</div>
    <h1>It's a YES!</h1>
    <p>
      The 11th December is officially getting exciting!
      Get ready for adventures, delicious food,
      endless laughter and beautiful memories.
    </p>
    <p>Someone is VERY happy right now! 🥹</p>
    <button class="celebration-close">
      LET'S MAKE MEMORIES ❤️
    </button>
  `;

  for (let i = 0; i < 65; i++) {
    const ribbon = document.createElement("span");
    ribbon.className = "ribbon-piece";
    ribbon.style.left = Math.random() * 100 + "%";
    ribbon.style.animationDuration = (3 + Math.random() * 4) + "s";
    ribbon.style.animationDelay = Math.random() * 2 + "s";

    ribbon.style.background = [
      "#ffeba2",
      "#d4af70",
      "#e8a0a8",
      "#ffffff",
      "#BE1C2B"
    ][Math.floor(Math.random() * 5)];

    celebration.appendChild(ribbon);
  }

  document.body.appendChild(celebration);

  celebration.querySelector(".celebration-close").addEventListener("click", () => {
    celebration.remove();
  });

  setTimeout(() => {
    if (celebration.isConnected) {
      celebration.remove();
    }
  }, 8000);
}

// BOTH YES BUTTONS
function confirmWithCelebration() {
  closeThinkAgainModal();
  showRibbonCelebration();
  signAgreement();
}

yesImInBtn.addEventListener("click", confirmWithCelebration);
yesObviouslyBtn.addEventListener("click", confirmWithCelebration);


// PDF GENERATION
function createPdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const left = 20, right = 190, width = right - left;
  let y = 20;

  pdf.setDrawColor(173, 138, 76);
  pdf.setLineWidth(.5);
  pdf.rect(10, 10, 190, 277);

  pdf.setTextColor(145, 112, 62);
  pdf.setFont("times", "bold");
  pdf.setFontSize(8);
  pdf.text("THE DEPARTMENT OF UNNECESSARY LOVE", 105, y, { align: "center" });

  y += 12;
  pdf.setTextColor(41, 37, 31);
  pdf.setFont("times", "normal");
  pdf.setFontSize(23);
  pdf.text("The 11th December", 105, y, { align: "center" });

  y += 9;
  pdf.setTextColor(154, 121, 69);
  pdf.text("Ownership Agreement", 105, y, { align: "center" });

  y += 9;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 90, 76);
  pdf.text("A declaration of plans, snacks, adventures & excellent company", 105, y, { align: "center" });

  y += 13;
  pdf.setDrawColor(215, 195, 154);
  pdf.line(left, y, right, y);
  y += 9;

  pdf.setTextColor(41, 37, 31);
  pdf.setFontSize(11);

  const paragraphs = [
    ["To: Vaishu", "Whereas the undersigned party has developed an entirely reasonable and non-negotiable desire to spend 11th December with you, this document establishes the following extremely important arrangements."],
    ["01 · Exclusive Day Ownership", "11th December belongs to me, of yous and only me. No sharing, no competing appointments, and absolutely no let's see without a very convincing explanation."],
    ["02 · Mandatory Adventure", "You agree to accompany me on a little trip. The destination may be revealed at the appropriate dramatic moment. Your role: show up, look cute, and enjoy the day."],
    ["03 · Food, Snacks & Feeding Rights", "I accept full responsibility for feeding you, treating you, and ensuring that hunger does not ruin our very important agenda."],
    ["04 · Happiness Is Compulsory", "Laughing, exploring, taking pictures, making memories, and enjoying ourselves are strongly encouraged. Smiling at my jokes is appreciated."],
    ["05 · Cancellation & Excuse Policy", "Excuses will be reviewed by the committee. Genuine emergencies are, of course, respected. This is romance, not a hostage situation."],
    ["06 · Memory Preservation", "All happy moments, silly conversations, food discoveries, and photographs shall be stored safely in the memory department for unlimited replay."],
    ["FINAL DECLARATION", "By signing below, you acknowledge that 11th December is reserved for travelling, eating, laughing, and spending time together. In short: I'm claiming the day. You're getting fed. We're going out. Deal?"]
  ];

  function ensureSpace(required) {
    if (y + required > 255) {
      pdf.addPage();
      y = 22;
    }
  }

  paragraphs.forEach(([heading, body]) => {
    ensureSpace(24);

    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(145, 112, 62);
    pdf.text(heading, left, y);
    y += 6;

    pdf.setFont("times", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(65, 59, 51);

    const lines = pdf.splitTextToSize(body, width);
    pdf.text(lines, left, y);
    y += lines.length * 4.6 + 6;
  });

  ensureSpace(40);
  pdf.setDrawColor(215, 195, 154);
  pdf.line(left, y, right, y);
  y += 13;

  pdf.setFont("times", "italic");
  pdf.setFontSize(25);
  pdf.setTextColor(38, 61, 104);
  pdf.text("Vaishu", left + 4, y);

  y += 5;
  pdf.setDrawColor(120, 107, 88);
  pdf.line(left, y, left + 85, y);
  y += 5;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(110, 100, 85);
  pdf.text("AUTHORIZED SIGNATORY · VAISHU", left, y);
  pdf.text(`SIGNED: ${new Date(signedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`, left, y + 5);

  pdf.setTextColor(164, 124, 62);
  pdf.setFont("times", "bold");
  pdf.setFontSize(12);
  pdf.text("✦ OFFICIALLY APPROVED ✦", 145, y + 2, { align: "center" });

  pdf.setTextColor(120, 107, 88);
  pdf.setFont("times", "italic");
  pdf.setFontSize(9);
  pdf.text("No refunds. Only memories.", 105, 278, { align: "center" });

  return pdf;
}


// EMAIL AND WHATSAPP NOTIFICATION
async function notifyOwner(pdfDataUri) {
  notificationStatus.textContent = "Sending your email and WhatsApp notifications…";

  const pdfBase64 = pdfDataUri.split(",")[1];
  signedPdfBase64 = pdfBase64;

  try {
    const response = await fetch("/api/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signer: "Vaishu",
        consent: true,
        signedAt: signedAt.toISOString(),
        pdfBase64
      })
    });

    const data = await response.json();

    const email = data.notifications?.email || "unknown";
    const whatsapp = data.notifications?.whatsapp || "unknown";

    notificationStatus.textContent =
      `Email: ${email.toUpperCase()} · WhatsApp: ${whatsapp.toUpperCase()}` +
      (data.setupErrors?.length ? " — " + data.setupErrors.join(" ") : "");

    if (data.ok) {
      showToast("Signature recorded! Notification sent. ❤️");
    } else {
      showToast("Signed! Notifications need setup — see status below.");
    }

  } catch (error) {
    notificationStatus.textContent =
      "Signature is complete in this browser, but the notification server could not be reached. Start the Node server and configure .env.";

    showToast("Signed, but the notification server is unavailable.");
  }
}


// SIGN AGREEMENT
async function signAgreement() {
  if (signedAt) return;

  signedAt = new Date();

  signTrigger.innerHTML = '<span>AGREEMENT SIGNED</span><span class="sign-arrow">✓</span>';
  signTrigger.disabled = true;

  signatureMark.classList.add("signed");

  signedDate.textContent = signedAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  pendingNote.textContent = "STATUS: OFFICIALLY APPROVED · VAISHU HAS SIGNED";
  approvalSeal.classList.add("show");

  belowActions.hidden = false;

  const pdf = createPdf();
  const pdfDataUri = pdf.output("datauristring");

  await notifyOwner(pdfDataUri);

  belowActions.scrollIntoView({ behavior: "smooth", block: "center" });
}


// DOWNLOAD SIGNED PDF
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!signedAt) return;

  createPdf().save("11-December-Ownership-Agreement-SIGNED.pdf");
});
