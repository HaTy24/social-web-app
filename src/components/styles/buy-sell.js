import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBuyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 56px;
  margin-bottom: 56px;
`;

export const StyledTextPrimary = styled.div`
  color: #1a1a1a;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
`;

export const InfoSharePice = styled.div`
  color: #4a4a4a;
  display: flex;
  text-align: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.25;
`;

export const QuantityInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Tương ứng với 2rem nếu 1rem = 4px */
`;

export const QuantityInput = styled.input`
  height: 40px;
  border-radius: 0.25rem;
  background-color: transparent;
  padding: 8px;
  border: 0;
  font-size: 36px;
  font-weight: 600;
  width: 160px;
  text-align: center;
  border: none;
  outline: none;
`;

export const QuantityInputLabel = styled.p`
  font-family: "Inter", sans-serif;
  color: #1a1a1a;
  font-size: 16px; /* Tương ứng với 4rem nếu 1rem = 4px */
  font-weight: 400;
`;

export const ApproxText = styled.div`
  font-family: "Inter", sans-serif;
  color: #4a4a4a;
  text-align: center;
  font-size: 14px; /* Tương ứng với 3.5rem nếu 1rem = 4px */
  font-weight: 400;
  line-height: 1.25;
`;
