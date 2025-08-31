// =======================
// Entities + Builder
// =======================

class Project {
  constructor(title, description, image, link) {
    this.title = title
    this.description = description
    this.image = image
    this.link = link
  }
}

class ProjectBuilder {
  constructor() {
    this.title = ""
    this.description = ""
    this.image = ""
    this.link = "#"
  }
  setTitle(title) {
    this.title = title
    return this
  }
  setDescription(description) {
    this.description = description
    return this
  }
  setImage(image) {
    this.image = image
    return this
  }
  setLink(link) {
    this.link = link
    return this
  }
  build() {
    return new Project(this.title, this.description, this.image, this.link)
  }
}

// =======================
// Modal Controller
// =======================

class ProjectsModal {
  constructor(modalId, openBtnId, closeBtnId, projectsContainerId) {
    this.modal = document.getElementById(modalId)
    this.openBtn = document.getElementById(openBtnId)
    this.closeBtn = document.getElementById(closeBtnId)
    this.overlay = this.modal.querySelector(".modal__overlay")
    this.container = document.getElementById(projectsContainerId)

    this.initEvents()
  }

  initEvents() {
    this.openBtn.addEventListener("click", () => this.open())
    this.closeBtn.addEventListener("click", () => this.close())
    this.overlay.addEventListener("click", () => this.close())
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close()
    })
  }

  open() {
    this.modal.classList.add("is-active")
  }

  close() {
    this.modal.classList.remove("is-active")
  }

  renderProjects(projects) {
    this.container.innerHTML = ""
    projects.forEach((p) => {
      const card = document.createElement("div")
      card.className = "project-card"
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer">Acessar</a>
      `
      this.container.appendChild(card)
    })
  }
}

// =======================
// Inicialização
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    new ProjectBuilder()
      .setTitle("Website Responsivo")
      .setDescription("Criação de site moderno e adaptável.")
      .setImage("./assets/projeto1.png")
      .setLink("https://meusite1.com")
      .build(),
    new ProjectBuilder()
      .setTitle("Landing Page")
      .setDescription("Página de alta conversão para captação de clientes.")
      .setImage("./assets/projeto2.png")
      .setLink("https://meusite2.com")
      .build(),
    new ProjectBuilder()
      .setTitle("Automação com n8n")
      .setDescription("Fluxos automatizados para otimizar processos.")
      .setImage("./assets/projeto3.png")
      .setLink("https://meusite3.com")
      .build(),
  ]

  const modal = new ProjectsModal(
    "projectsModal",
    "openProjectsBtn",
    "closeModalBtn",
    "projectsContainer"
  )

  modal.renderProjects(projects)
})

