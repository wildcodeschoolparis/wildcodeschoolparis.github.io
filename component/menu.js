import { Container, Image, Menu, Icon } from 'semantic-ui-react'
import Link from 'next/link'


const isRouteEq = (a, b) => a === b
  || (a + '/') === b

const L = (href, { pathname, value, header, prefetch }) =>
  <Link href={href} prefetch={prefetch} passHref>
    <Menu.Item as='a' header={header} active={isRouteEq(pathname, href)}>
      {value || (href[1].toUpperCase() + href.slice(2).toLowerCase())}
    </Menu.Item>
  </Link>

export default (state, { router: { pathname } }) => {
  const user = state && state.user || {}
  return (
    <Menu fixed='top' inverted pointing>
      <Container>
        {L('/', {
          pathname,
          header: true,
          value:
            <React.Fragment>
              <Image
                size='mini'
                src='//wildcodeschool.fr/wp-content/uploads/2017/01/logo_orange_pastille.png'
                style={{ marginRight: '1.5em' }}
              />
              Wild Code School Paris
            </React.Fragment>,
        })}
        { L('/refs', { pathname })}
        <Menu.Menu position='right'>
          {user.role && L('/admin', { pathname })}
          { L('/profile', {
              pathname,
              value: <Icon
                style={{ margin: 0 }}
                size='big'
                name='user circle outline' />,
          })}
        </Menu.Menu>
      </Container>
    </Menu>
  )
}
