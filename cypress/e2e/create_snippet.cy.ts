describe('End-to-End: Create Snippet', () => {
    const snippetTitle = `Test Snippet ${Date.now()}`
    const snippetContent = 'console.log("Hello, E2E!");'

    it('should create a new snippet and display it in the list', () => {
        cy.visit('http://localhost')

        // Open the modal or form to create a snippet
        cy.contains('New Snippet').click()

        // Fill out the form fields (adjust selectors as needed)
        cy.get('input[placeholder="Enter snippet title..."]').type(snippetTitle)
        cy.get('textarea[placeholder="Paste your code here..."]').type(
            snippetContent,
        )

        // Optionally, check public/private if available

        // Save the snippet
        cy.contains('Save Snippet').click()

        // Verify the snippet appears in the list
        cy.contains(snippetTitle).should('be.visible')
    })

    it('should verify the snippet exists via backend API', () => {
        cy.request('/api/snippets').then((response) => {
            expect(response.status).to.eq(200)
            const found = response.body.some(
                (s: any) =>
                    s.title === snippetTitle && s.content === snippetContent,
            )
            expect(found).to.be.true
        })
    })

    after(() => {
        // Find and delete the snippet created during the test
        cy.request('/api/snippets').then((response) => {
            const snippetToDelete = response.body.find(
                (s: any) => s.title === snippetTitle,
            )

            if (snippetToDelete) {
                cy.request(
                    'DELETE',
                    `/api/snippets/${snippetToDelete.id}`,
                ).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eq(204)
                })
            }
        })
    })
})
