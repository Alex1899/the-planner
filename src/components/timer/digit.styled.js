import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  &: first-child {
    margin-left: 0;
  }
`;

const Title = styled.span`
  font-size: 11px;
 
  color: white;
  margin-bottom: 5px;
  margin-top: 5px;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
    margin-top: 0;
  }
`;

const DigitContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
`;

const SingleDigit = styled.span`
  position: relative;
  display: flex;
  flex: 0 1 25%;
  font-size: 15px;
  background-color: #303030;
  border-radius: 5px;
  padding: 10px 12px;
  color: white;
  &:first-child {
    margin-right: 2px;
  }
  &:after {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 50%;
    bottom: 50%;
    content: "";
    width: '100%';
    height: 2px;
    background-color: #232323;
    opacity: 0.4;
  }
  @media only screen and (max-width: 600px) {
    font-size: 12px;
    padding: 5px 6px;
  }
`;

export default function Digit({ value, title }) {
  const leftDigit = value >= 10 ? value.toString()[0] : '0';
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
  return (
    <Container>
      <Title>{title}</Title>
      <DigitContainer>
        <SingleDigit>
          {leftDigit}
        </SingleDigit>
        <SingleDigit>
          {rightDigit}
        </SingleDigit>
      </DigitContainer>
    </Container>
  );
}