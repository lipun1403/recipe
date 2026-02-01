// Protect page (must be logged in)
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../auth/auth.html";
}

document.getElementById("savePref").addEventListener("click", async () => {
  const diet_type = document.getElementById("diet").value;
  const cooking_level = document.getElementById("level").value;

  // Allergies (checkboxes)
  const allergyChecks = Array.from(
    document.querySelectorAll("input[name='allergy']:checked")
  ).map((el) => el.value);

  // Allergies (manual)
  const allergyCustom = document
    .getElementById("allergyCustom")
    .value.split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");

  const allergies = [...new Set([...allergyChecks, ...allergyCustom])].join(
    ","
  );

  // Disliked ingredients (checkboxes)
  const dislikedChecks = Array.from(
    document.querySelectorAll("input[name='disliked']:checked")
  ).map((el) => el.value);

  // Disliked ingredients (manual)
  const dislikedCustom = document
    .getElementById("dislikedCustom")
    .value.split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");

  const disliked_ingredients = [
    ...new Set([...dislikedChecks, ...dislikedCustom]),
  ].join(",");

  if (!diet_type || !cooking_level) {
    alert("Please select diet type and cooking level");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        diet_type,
        cooking_level,
        allergies,
        disliked_ingredients,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to save preferences");
      return;
    }

    alert("Preferences saved successfully");
    window.location.href = "../index.html";
  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert(err.message);
  }
});
