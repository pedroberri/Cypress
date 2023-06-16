/// <reference types="cypress" />
describe('video app test', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
  })

  it('Verificar se o reprodutor de vídeo está visível quando um vídeo é selecionado na lista de vídeos', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').should('be.visible')
  })

  it('Testar se o vídeo começa a ser reproduzido quando um vídeo é selecionado', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').should('have.prop', 'paused', false)
  })

  it('Testar os controles do reprodutor de vídeo. Verifique se o vídeo pausa quando o botão de pausa é clicado e se retoma quando o botão de play é clicado', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').should('be.visible').as('video')
    cy.get('@video').then(($video) => {
      $video[0].pause()
    })
    cy.get('@video').should('have.prop', 'paused', true)
    cy.get('@video').then(($video) => {
      $video[0].play()
    })
    cy.get('@video').should('have.prop', 'paused', false)
  })

  it('Verificar se a barra de progresso está funcionando corretamente, mostrando o progresso conforme o vídeo avança', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').should('be.visible')
    cy.get('#videoPlayer').then(($video) => {
      $video[0].play()
    })

    cy.wait(3000)
    cy.get('#videoPlayer').then(($video) => {
      const initialTime = $video[0].currentTime
      expect(initialTime).to.be.greaterThan(0);
    })
  })

  it('Verificar se a lista de vídeos é renderizada corretamente na tela inicial', () => {
    cy.get('.thumbnail').should('exist').should('have.length.greaterThan', 0)
  })

  it('Verificar se a miniatura e o título de cada vídeo são exibidos corretamente na lista', () => {
    cy.get('.thumbnail').should('exist')
    cy.get('.video-title').should('exist').first().should('have.text', "Big Buck Bunny")
    cy.get('.video-title').should('exist').last().should('have.text', "Elephants Dream")
  })

  it('Testar a funcionalidade de pesquisa inserindo uma palavra-chave e verificando se a lista de vídeos é filtrada corretamente', () => {
    cy.get('#search').type('Buck')
    cy.get('.btn-primary').click()
    cy.get('.video-title').should('have.text', "Big Buck Bunny")
  })

  it(' Verificar se a filtragem funciona corretamente ao pressionar Enter', () => {
    cy.get('#search').type('Buck{enter}')
    cy.get('.video-title').should('have.text', "Big Buck Bunny")
  })

  it('Verificar se a seção de comentários está visível quando um vídeo está sendo reproduzido', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#commentInput').should('be.visible')
  })

  it('Testar a funcionalidade de postagem de comentários. Verifique se um novo comentário é adicionado à lista de comentários quando o usuário insere um comentário e pressiona Enter', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#commentInput').type('Teste comentário{enter}')
    cy.get('#comments').should('have.length.greaterThan', 0)
  })

  it('Verificar se a data e a hora são exibidas corretamente para cada comentário', () => {
    cy.get('.thumbnail').first().click();
    cy.get('#commentInput').type('Teste comentário{enter}');
    cy.get('#comments p').first().should(($comment) => {
      const commentText = $comment.text()

      const currentDate = new Date()
      const string = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString()

      expect(commentText).to.contain(string)
    })
  });

  it('Verificar se o contador de visualizações incrementa cada vez que um vídeo é reproduzido', () => {
    cy.get('.thumbnail').first().click();
    cy.get('#viewCount').should('have.length.greaterThan', 0)
  });
})