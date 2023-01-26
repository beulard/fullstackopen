describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Super User',
            username: 'root',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)

        cy.visit('http://localhost:3000')
    })
    it('opens app on login form', function () {
        cy.contains('log in')
    })

    describe('login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('root')
            cy.get('#password').type('password')
            cy.get('#login-button').click()

            cy.contains('Logged in as')
        })

        it('fails if password is wrong', function () {
            cy.get('#username').type('root')
            cy.get('#password').type('wrong_password')
            cy.get('#login-button').click()

            cy.get('#notificationBox').contains('password incorrect')
        })

        it('fails if user doesn\'t exist', function () {
            cy.get('#username').type('bad_username')
            cy.get('#password').type('password')
            cy.get('#login-button').click()

            cy.get('#notificationBox').contains('user does not exist')
        })
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'root', password: 'password' })
        })

        it('enables user to create a new entry', function () {
            cy.get('button').contains('add blog').click()

            cy.get('#titleBox').type('A new blog entry')
            cy.get('#authorBox').type('John Smith')
            cy.get('#urlBox').clear().type('http://theblogurl.org')
            cy.contains('submit').click()

            cy.get('#blogList').contains('A new blog entry by John Smith')

            cy.get('#blogList').contains('A new blog entry').contains('show').click()
            cy.get('#blogList').contains('A new blog entry').contains('http://theblogurl.org').should('be.visible')
            cy.get('#blogList').contains('A new blog entry').contains('0 likes').should('be.visible')
        })

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.createBlog({ title: 'A new blog entry', author: 'John Smith', url: 'http://theblogurl.org' })
            })

            it('user can like the blog', function () {
                cy.get('#blogList').contains('A new blog entry').contains('show').click()
                cy.get('#blogList').contains('A new blog entry').contains('like').click()

                cy.get('#blogList').contains('A new blog entry').contains('1 likes')
            })
            it('user can delete the entry they created', function() {
                cy.get('#blogList').contains('A new blog entry').contains('show').click()
                cy.get('#blogList').contains('A new blog entry').contains('remove').click()

                cy.get('#blogList').not().contains('A new blog entry')
            })
        })

        describe('and two blogs exist', function() {
            beforeEach(function () {
                cy.createBlog({ title: 'A first blog entry', author: 'John Smith', url: 'http://theblogurl.org/1' })
                cy.createBlog({ title: 'A second blog entry', author: 'John Smith', url: 'http://theblogurl.org/2' })
            })
            it('the most liked blog appears before the other', function() {
                cy.get('#blogList').contains('A first blog entry').as('first')
                cy.get('#blogList').contains('A second blog entry').as('second')

                // Like the first one once
                cy.get('@first').contains('show').click()
                cy.get('@first').contains('like').click()
                // The first one should now be at the top
                cy.get('.blog').eq(0).contains('first')
                cy.get('.blog').eq(1).contains('second')

                // Like the second one twice
                cy.get('@second').contains('show').click()
                cy.get('@second').contains('like').click()
                // Wait for it to update and click again, and wait again
                cy.get('@second').contains('1 likes')
                cy.get('@second').contains('like').click()
                cy.get('@second').contains('2 likes')
                // The second one should now be at the top
                cy.get('.blog').eq(0).contains('second')
                cy.get('.blog').eq(1).contains('first')
            })
        })


        it('user can log out', function () {
            cy.contains('log out').click()

            cy.contains('Logged out')
            cy.contains('log in')
        })
    })
})