import { useEffect, useMemo, useState } from 'react';
import { Header, Loader, Button, Table } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import styles from './CoffeeChatDashboard.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { getLinesFromBoard } from '../../../utils';

type CoffeeChatStats = {
  fulfilledCategories: string[];
  bingo: boolean;
  blackout: boolean;
};

const CoffeeChatDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bingoBoard, setBingoBoard] = useState<string[][]>([]);
  const [coffeeChats, setCoffeeChats] = useState<CoffeeChat[]>([]);

  const allMembers = useMembers();

  useEffect(() => {
    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => {
      setBingoBoard(board);
    });

    CoffeeChatAPI.getAllCoffeeChats().then((chats) => {
      setCoffeeChats(chats.filter((chat) => chat.status === 'approved'));
    });

    setIsLoading(false);
  }, []);

  const categories = bingoBoard.flat();

  const coffeeChatStats = useMemo(() => {
    const stats: { [key: string]: CoffeeChatStats } = {};

    allMembers.forEach((member) => {
      const chatsByMember = coffeeChats.filter((chat) => chat.submitter.netid === member.netid);
      const fulfilledCategories = chatsByMember.map((chat) => chat.category);
      const blackout = categories.every((category) => fulfilledCategories.includes(category));
      let bingo = false;

      const linesToCheck = getLinesFromBoard(bingoBoard);

      linesToCheck.forEach((line) => {
        bingo = line.every((category) => fulfilledCategories.includes(category));
      });

      stats[member.netid] = { fulfilledCategories, blackout, bingo };
    });
    return stats;
  }, [allMembers, bingoBoard, categories, coffeeChats]);

  const handleExportToCsv = () => {
    const csvData = allMembers.map((member) => {
      const data = categories.reduce(
        (prev, cateogry) => ({
          ...prev,
          [cateogry]: coffeeChatStats[member.netid].fulfilledCategories.includes(cateogry) ? 1 : 0
        }),
        {
          Name: `${member.firstName} ${member.lastName}`,
          NetID: `${member.netid}`,
          Blackout: coffeeChatStats[member.netid].blackout ? 'Yes' : 'No',
          Bingo: coffeeChatStats[member.netid].bingo ? 'Yes' : 'No'
        }
      );

      return data;
    });

    const options: Options = {
      filename: `Coffee_Chat_Dashboard`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Coffee Chat Dashboard`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvData);
  };

  if (isLoading) return <Loader active>Fetching coffee chat data...</Loader>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerContainer}>
        <Header as="h1">Team Event Dashboard</Header>
        <div className={styles.csvButton}>
          <Button onClick={handleExportToCsv}>Export to CSV</Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table celled selectable striped>
          <Table.Header>
            <Table.HeaderCell className={styles.nameCell}>Name</Table.HeaderCell>
            <Table.HeaderCell>Blacked Out?</Table.HeaderCell>
            <Table.HeaderCell>Bingo?</Table.HeaderCell>
            {categories.map((category, index) => (
              <Table.HeaderCell key={index}>{category}</Table.HeaderCell>
            ))}
          </Table.Header>
          <Table.Body>
            {allMembers.map((member, index) => (
              <Table.Row key={index}>
                <Table.Cell className={styles.nameCell}>
                  {member.firstName} {member.lastName} ({member.netid})
                </Table.Cell>
                <Table.Cell>{coffeeChatStats[member.netid].blackout ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{coffeeChatStats[member.netid].bingo ? 'Yes' : 'No'}</Table.Cell>
                {categories.map((category) => (
                  <Table.Cell>
                    {coffeeChatStats[member.netid].fulfilledCategories.includes(category) ? 1 : 0}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default CoffeeChatDashboard;