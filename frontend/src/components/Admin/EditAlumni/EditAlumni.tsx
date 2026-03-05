import { Button, Card, Input, Table } from 'semantic-ui-react';
import  styles from './EditAlumni.module.css';


export default function EditAlumni(): JSX.Element {
  return (
  <div className={styles.content}>
        <h1> Alumni Database </h1>
        <div className={styles.toolbar}>
            <Input
                icon="search"
                placeholder="Search alumni..."
            />

            <Button primary>
                Edit Alumni
            </Button>
        </div>
        <Table>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Company</Table.HeaderCell>
                <Table.HeaderCell>Position</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            <Table.Row>
                <Table.Cell>John Doe</Table.Cell>
                <Table.Cell>john.doe@example.com</Table.Cell>
                <Table.Cell>Example Inc.</Table.Cell>
                <Table.Cell>Software Engineer</Table.Cell>
            </Table.Row>
        </Table.Body>
      </Table>
  </div>
  )
  ;
}