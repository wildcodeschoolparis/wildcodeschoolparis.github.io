import { Container, Image, Menu } from 'semantic-ui-react'
import Link from 'next/link'

export default state => {
  const isTrainer = state && state.isTrainer

  return (
    <Menu fixed='top' inverted>
      <Container>
        <Link href="/" passHref>
          <Menu.Item as='a' header>
            <Image
              size='mini'
              src='//wildcodeschool.fr/wp-content/uploads/2017/01/logo_orange_pastille.png'
              style={{ marginRight: '1.5em' }}
            />
            Wild Code School Paris
          </Menu.Item>
        </Link>
        {isTrainer &&
          <Link href="/trainer" passHref>
            <Menu.Item as='a' >Status</Menu.Item>
          </Link>}
      </Container>
    </Menu>
  )
}
