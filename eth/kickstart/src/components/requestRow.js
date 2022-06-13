import { Button, Table } from "semantic-ui-react";
import web3 from "../../ethereum/web3";

const RequestRow = ({ id, request, onApprove, onFinalize, approversCount }) => {
  const { Row, Cell } = Table;
  const completed = request.complete;
  const readyToFinalize = request.approvalCount > approversCount / 2;


  return (
    <Row disabled={completed} positive={readyToFinalize}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{request.approvalCount}/{approversCount}</Cell>
      <Cell>{!completed && <Button color="green" basic onClick={onApprove}>Approve</Button>}</Cell>
      <Cell>{!completed && <Button color="teal" basic onClick={onFinalize}>Finalize</Button>}</Cell>
    </Row>
  );
};

export default RequestRow;