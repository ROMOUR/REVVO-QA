it('Test', () => {
    const data = {
      login: 'admin',
      password: 'sandbox24',
      courseName: 'Desafio Revvo QA',
      shortCourseName: 'Revvo'
    };
  
    cy.intercept('POST', '/lib/ajax/service.php*').as('servicePHP');
    cy.intercept('GET', '/lib/ajax/service-nologin.php*').as('serviceNoLogin');
  
    cy.visit('https://sandbox.moodledemo.net/login/index.php');
  
    // Realizando login
    cy.get('.mb-4').should('have.text', 'Log in to Moodle 4.5 sandbox demo');
    cy.get('#username')
      .should('have.attr', 'placeholder', 'Username')
      .type(data.login)
      .should('have.value', data.login);
    cy.get('#password')
      .should('have.attr', 'placeholder', 'Password')
      .type(data.password)
      .should('have.value', data.password);
    cy.get('#loginbtn').click();
  
    // Aguardando as requisições e verificando idioma
    cy.wait('@servicePHP');
    cy.wait('@serviceNoLogin');
    cy.get('[data-key="home"] > .nav-link').should('contain', 'Home');
    cy.get('.h2').should('contain', 'Hi, Admin!');
  
    // Alterando idioma para português
    cy.get('#user-menu-toggle').click();
    cy.get('#carousel-item-main > .carousel-navigation-link')
      .contains('Language')
      .click({ force: true });
    cy.get('[lang="pt-br"]')
      .should('contain', 'Português')
      .click({ force: true });
    cy.get('[data-key="home"] > .nav-link').should('contain', 'Página inicial');
  
    // Navegando para "Meus cursos"
    cy.get('[data-key="mycourses"] > .nav-link')
      .contains('Meus cursos')
      .click();
    cy.get('.h2').should('have.text', 'Meus cursos');
    cy.get('#instance-33-header').should('have.text', 'Resumo dos cursos');
  
    // Criando um novo curso
    cy.get('[action="https://sandbox.moodledemo.net/course/edit.php"] > .btn')
      .contains('Criar curso')
      .click();
    cy.get('#id_fullname')
      .type(data.courseName)
      .should('have.value', data.courseName);
    cy.get('#id_shortname')
      .type(data.shortCourseName)
      .should('have.value', data.shortCourseName);
    cy.get('.mb-3 > span > #id_saveanddisplay').click();
  
    // Validando curso criado
    cy.get('.page-header-headings > .h2', { timeout: 20000 })
      .should('have.text', data.courseName)
      .then(() => {
        cy.log('Curso criado com sucesso.');
      });
  
    // Verificando curso criado
    cy.get('.page-header-headings > .h2').should('have.text', data.courseName);
  
    // Deletando o curso
    cy.get('[data-key="mycourses"] > .nav-link').click();
    cy.get('[action="https://sandbox.moodledemo.net/course/management.php"] > .btn')
      .contains('Gerenciar cursos')
      .click();
    cy.get('.card-body > .ml').should('contain', data.courseName);
    cy.get('.action-delete > .icon').first().click({ force: true });
  
    // Espera pelo modal e validação
    cy.get('#modal-body', { timeout: 20000 })
      .should('exist')
      .and('be.visible')
      .should(
        'contain',
        `Tem certeza que quer excluir completamente este curso e todos os seus dados?`
      )
      .should('contain', `${data.courseName} (${data.shortCourseName})`);
  
    cy.get('[action="https://sandbox.moodledemo.net/course/delete.php"] > .btn')
      .contains('Excluir')
      .click();
  
    // Verificando se o curso foi deletado
    cy.get('.card-body > .ml', { timeout: 20000 }).should('not.contain', data.courseName);
  });