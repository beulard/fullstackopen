const { render, screen } = require('@testing-library/react')
import '@testing-library/jest-dom/extend-expect'
import { Togglable } from './Togglable'
import userEvent from '@testing-library/user-event'


describe('<Togglable />', () => {
    let container

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv">
                    togglable content
                </div>
            </Togglable>
        ).container
    })

    it('renders its children', async () => {
        await screen.findAllByText('togglable content')
    })
    it('does not display children at start', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
    it('displays children after clicking show button', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })
    it('hides content when closed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const closeButton = screen.getByText('cancel')
        user.click(closeButton)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })
})