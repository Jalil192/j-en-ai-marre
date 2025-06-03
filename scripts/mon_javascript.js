document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lightForm");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage = document.getElementById("newsletterMessage");
  const statsContainer = document.getElementById("statsContainer");

  const causeCount = JSON.parse(localStorage.getItem("causeCount")) || {
    ecologie: 0,
    sante: 0,
    egalite: 0,
    education: 0,
  };

  const countryMap = JSON.parse(localStorage.getItem("countryMap")) || {};

  const colorMap = {
    ecologie: "green",
    sante: "blue",
    egalite: "orange",
    education: "purple",
  };

  const icons = {
    ecologie: "🌿",
    sante: "🧬",
    egalite: "⚖️",
    education: "📚",
  };

  // Formulaire "Illumine ta lumière"
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const cause = form.cause.value;
    const pays = form.pays.value;

    if (!cause || !pays) return;

    // ➕ Mise à jour
    causeCount[cause]++;
    if (!countryMap[pays]) countryMap[pays] = {};
    if (!countryMap[pays][cause]) countryMap[pays][cause] = 0;
    countryMap[pays][cause]++;

    // 💾 Stockage
    localStorage.setItem("causeCount", JSON.stringify(causeCount));
    localStorage.setItem("countryMap", JSON.stringify(countryMap));

    // 📊 Affichage + timer d’expiration
    renderStats(statsContainer, causeCount, countryMap);
    statsContainer.style.display = "block";

    setTimeout(() => {
      statsContainer.style.display = "none";
    }, 120000); // 2 minutes = 120000 ms

    form.reset();
  });

  // Newsletter inscription
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = e.target.newsletterEmail.value.trim();
    if (!email) return;

    newsletterMessage.textContent = `Merci ! Ton inscription à UmanitY est bien enregistrée : ${email}`;
    newsletterMessage.classList.remove("d-none");

    setTimeout(() => {
      newsletterMessage.classList.add("d-none");
    }, 5000);

    newsletterForm.reset();
  });

  // Fonction affichage stats
  function renderStats(container, causes, countries) {
    let html = `
      <div class="cause-stats">
        <h3 class="mb-3">🌍 Lumières allumées par cause</h3>
        <table class="table table-dark table-striped border-white border rounded">
          <thead><tr><th>Cause</th><th>Participants</th><th>Lumière</th></tr></thead><tbody>`;

    for (const cause in causes) {
      html += `
        <tr>
          <td>${icons[cause]} ${capitalize(cause)}</td>
          <td>${causes[cause]}</td>
          <td><span class="light-circle" style="--intensity:${causes[cause]}; color:${colorMap[cause]}"></span></td>
        </tr>`;
    }

    html += `</tbody></table>
      <h4 class="mt-4">📍 Répartition par pays</h4><ul class="list-unstyled">`;

    for (const country in countries) {
      const entries = countries[country];
      const text = Object.entries(entries)
        .map(([cause, count]) => `${icons[cause] || ""} ${count}`)
        .join(", ");
      html += `<li><strong>${country}</strong> → ${text}</li>`;
    }

    html += `</ul></div>`;
    container.innerHTML = html;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ❌ Ne pas afficher stats au démarrage
  statsContainer.style.display = "none";
});

