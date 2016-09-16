// THESE ARRAYS HOLD THE ANSWERS THAT THE USER SELECTED FOR EACH SECTION
var picSectionCollector = new Array(15);
var vocabularySectionCollector = new Array(17);
var recallSectionCollector = new Array(6);
var recallBackwardsSectionCollector = new Array(5);
var relationshipSectionCollector = new Array(10);
var arithmeticSectionCollector = new Array(10);

/*
// pass in correct answers - correct for all
var picSectionCollector = new Array(3,2,3,4,3,3,1,3,0,3,0,1,3,4,2);
var vocabularySectionCollector = new Array(2,1,3,2,2,2,2,3,1,0,0,2,2,0,1,0,2);
var recallSectionCollector = new Array(5718,67154,243615,8341679,39485721,718492653);
var recallBackwardsSectionCollector = new Array(7615,78346,621749,8379426,58419273);
var relationshipSectionCollector = new Array(2,0,2,1,1,2,2,0,2,1);
var arithmeticSectionCollector = new Array(1,1,3,1,2,2,3,1,2,1);


// example of some wrong answers being passed in
var picSectionCollector = new Array(1,1,1,1,1,1,2,1,1,1,1,1,1,1,1); // all wrong
var vocabularySectionCollector = new Array(1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,2); // 15 wrong
var recallSectionCollector = new Array(5718,12345,1234,54854,1234,548745); // 4 wrong
var recallBackwardsSectionCollector = new Array(5487,1234,1234,1234,1234); // all wrong
var relationshipSectionCollector = new Array(1,0,1,1,1,2,2,0,2,1); // 2 wrong
var arithmeticSectionCollector = new Array(0,1,0,0,0,0,0,0,2,1); // 7 wrong
*/

// END

var fullName;

/*
 RETURNS THE ANSWER THAT THE USER SELECTED.
 SINCE JAVASCRIPT HAS TO LOOP THROUGH THE RADIO OBJECT TO GET THE SELECT ANSWER,
 I PUT THE FUNCTION HERE TO BE ACCESSED BY EVERY HTML PAGE INSTEAD OF COPY/PASTING
 THIS FUNCTION INTO EVERY SINGLE PAGE.
*/
function chosenAnswer()
{
   for(i=0; i<parent.frames['content'].document.actionForm.ANSWER.length; i++)
   {
      if( parent.frames['content'].document.actionForm.ANSWER[i].checked == true )
      {
         //alert(parent.frames['content'].document.actionForm.ANSWER[i].value);
         return parent.frames['content'].document.actionForm.ANSWER[i].value;
      }
   }
}

function chosenAnswerFillIn()
{
   return parent.frames['content'].document.actionForm.ANSWER.value;;
}

// START WITH RAW SCORE METHODS HERE
function getPictureSectionRawScore()
{
   var weight = .76923;
   var startPoints = 8.47;
   var correctAnswers = new Array(3,2,3,4,3,3,1,3,0,3,0,2,3,4,2);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<picSectionCollector.length; i++)
   {
      if( picSectionCollector[i] == correctAnswers[i] )
      {
         correctCount++;
      }
   }
   //if(correctCount != 0) { correctCount=correctCount+1; }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}

function getVocabularySectionRawScore()
{
   var weight = .74;
   var startPoints = 7.4;
   var correctAnswers = new Array(2,1,3,2,2,2,2,3,1,0,0,2,2,0,1,0,2);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<vocabularySectionCollector.length; i++)
   {
      if( vocabularySectionCollector[i] == correctAnswers[i] )
      {
         correctCount++;
      }
   }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}

function getRecallSectionRawScore()
{
   var weight = .83333;
   var startPoints = 4.16;
   var correctAnswers = new Array(5718,67154,243615,8341679,39485721,718492653);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<recallSectionCollector.length; i++)
   {
      if( recallSectionCollector[i] == correctAnswers[i] )
      {
         correctCount++;
      }
   }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}

function getRecallBackwardsSectionRawScore()
{
   var weight = 1.0;
   var startPoints = 5;
   var correctAnswers = new Array(7615,78346,621749,8379426,58419273);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<recallBackwardsSectionCollector.length; i++)
   {
      if( recallBackwardsSectionCollector[i] == correctAnswers[i] )
      {
         correctCount++;
      }
   }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}

function getRelationshipSectionRawScore()
{
   var weight = 1.6666;
   var startPoints = 3.33333;
   var correctAnswers = new Array(2,0,2,1,1,2,2,0,2,1);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<relationshipSectionCollector.length; i++)
   {
      if( relationshipSectionCollector[i] == correctAnswers[i] )
      {
         correctCount++;
      }
   }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}

function getArithmeticSectionRawScore()
{
   var weight = 1.11111;
   var startPoints = 6.66666;
   var correctAnswers = new Array(1,1,3,1,2,2,3,1,2,1);
   var correctCount = 0;
   var rawScore = 0;
   
   for(i=0; i<arithmeticSectionCollector.length; i++)
   {
      if( arithmeticSectionCollector[i] == correctAnswers[i] )
      {
         if( i == 8 || i == 9)
         {
            correctCount=correctCount+2;
         }
         else
         {
            correctCount=correctCount+1;
         }
      }
   }
   rawScore = (correctCount * weight) + startPoints;
   return rawScore;
}
// END WITH RAW SCORE METHODS HERE

// START WITH POLYSCALE SCORE METHODS HERE
function getFullPolyScaleScore()
{
   var picRaw = getPictureSectionRawScore();
   var vocRaw = getVocabularySectionRawScore();
   var recallRaw = getRecallSectionRawScore();
   var recallbRaw = getRecallBackwardsSectionRawScore();
   var relationRaw = getRelationshipSectionRawScore();
   var arithRaw = getArithmeticSectionRawScore();
   var sum = picRaw + vocRaw + recallRaw + recallbRaw + relationRaw + arithRaw;
   // change these values
   var iMax = 100;
   var rescaleMax = 182;
   var xSquaredConst = .001;
   var xConst = .4428;
   var yConst = 38.878;
   //end
   var percentage = sum/iMax;
   var polyScale = 0;
   var x = rescaleMax * percentage;
   polyScale = ((x*x)*xSquaredConst) + (xConst * x) + yConst;					

   return polyScale;
}

function getVerbalPolyScaleScore()
{
   var vocRaw = getVocabularySectionRawScore();
   var relationRaw = getRelationshipSectionRawScore();
   var arithRaw = getArithmeticSectionRawScore();
   var sum = vocRaw + relationRaw + arithRaw;
   // change these values
   var iMax = 60;
   var rescaleMax = 182;
   var xSquaredConst = .001;
   var xConst = .4428;
   var yConst = 38.878;
   //end
   var percentage = sum/iMax;
   var polyScale = 0;
   var x = rescaleMax * percentage;
   polyScale = ((x*x)*xSquaredConst) + (xConst * x) + yConst;					

   return polyScale;
}

function getPerformancePolyScaleScore()
{
   var picRaw = getPictureSectionRawScore();
   var recallRaw = getRecallSectionRawScore();
   var recallbRaw = getRecallBackwardsSectionRawScore();
   var sum = picRaw + recallRaw + recallbRaw;
   // change these values
   var iMax = 40;
   var rescaleMax = 182;
   var xSquaredConst = 0.001;
   var xConst = 0.4428;
   var yConst = 38.878;
   //end
   var percentage = sum/iMax;
   var polyScale = 0;
   var x = rescaleMax * percentage;
   polyScale = ((x*x)*xSquaredConst) + (xConst * x) + yConst;					

   return polyScale;
}
// END WITH POLYSCALE SCORE METHODS HERE

function getSectionMean()
{
   var picRaw = getPictureSectionRawScore();
   var vocRaw = getVocabularySectionRawScore();
   var recallRaw = getRecallSectionRawScore();
   var recallbRaw = getRecallBackwardsSectionRawScore();
   var relationRaw = getRelationshipSectionRawScore();
   var arithRaw = getArithmeticSectionRawScore();
   var sum = picRaw + vocRaw + recallRaw + recallbRaw + relationRaw + arithRaw;
   var mean = sum/5;
   
   return mean;
}

function getDescription()
{
   var descriptCat = "";
   if(getFullPolyScaleScore() > 90.0) descriptCat = "Genomsnittlig";
   if(getFullPolyScaleScore() > 110.0) descriptCat = "Övernormal";
   if(getFullPolyScaleScore() > 120.0) descriptCat = "Hög";
   if(getFullPolyScaleScore() > 130.0) descriptCat = "Mycket hög";
   
   return descriptCat;
}

function roundNumber(val,length) {
	var rlength = length; // The number of decimal places to round to
	var newnumber = Math.round(val*Math.pow(10,rlength))/Math.pow(10,rlength);

   return newnumber;
}

function getPercentile(num)
{
   if( num < 50)
   {
      return 0;
   }
   if( num > 160)
   {
      return 99.9;
   }
   
   var NDSTable = new Array();
   NDSTable[50] =	0.000429117;
   NDSTable[51] =	0.000544169;
   NDSTable[52] =	0.000687202;
   NDSTable[53] =	0.000864232;
   NDSTable[54] =	0.001082369;
   NDSTable[55] =	0.001349967;
   NDSTable[56] =	0.001676786;
   NDSTable[57] =	0.002074164;
   NDSTable[58] =	0.002555191;
   NDSTable[59] =	0.003134896;
   NDSTable[60] =	0.003830425;
   NDSTable[61] =	0.004661222;
   NDSTable[62] =	0.005649194;
   NDSTable[63] =	0.00681887;
   NDSTable[64] =	0.008197529;
   NDSTable[65] =	0.009815307;
   NDSTable[66] =	0.011705262;
   NDSTable[67] =	0.013903399;
   NDSTable[68] =	0.016448637;
   NDSTable[69] =	0.019382721;
   NDSTable[70] =	0.022750062;
   NDSTable[71] =	0.026597505;
   NDSTable[72] =	0.030974012;
   NDSTable[73] =	0.035930266;
   NDSTable[74] =	0.04151818;
   NDSTable[75] =	0.04779033;
   NDSTable[76] =	0.054799289;
   NDSTable[77] =	0.062596891;
   NDSTable[78] =	0.071233414;
   NDSTable[79] =	0.080756711;
   NDSTable[80] =	0.091211282;
   NDSTable[81] =	0.102637318;
   NDSTable[82] =	0.115069732;
   NDSTable[83] =	0.128537199;
   NDSTable[84] =	0.143061222;
   NDSTable[85] =	0.15865526;
   NDSTable[86] =	0.175323924;
   NDSTable[87] =	0.193062292;
   NDSTable[88] =	0.211855334;
   NDSTable[89] =	0.231677501;
   NDSTable[90] =	0.252492467;
   NDSTable[91] =	0.274253065;
   NDSTable[92] =	0.296901405;
   NDSTable[93] =	0.320369203;
   NDSTable[94] =	0.344578303;
   NDSTable[95] =	0.369441404;
   NDSTable[96] =	0.394862969;
   NDSTable[97] =	0.420740313;
   NDSTable[98] =	0.44696485;
   NDSTable[99] =	0.473423466;
   NDSTable[100] =	0.5;
   NDSTable[101] =	0.526576534;
   NDSTable[102] =	0.55303515;
   NDSTable[103] =	0.579259687;
   NDSTable[104] =	0.605137031;
   NDSTable[105] =	0.630558596;
   NDSTable[106] =	0.655421697;
   NDSTable[107] =	0.679630797;
   NDSTable[108] =	0.703098595;
   NDSTable[109] =	0.725746935;
   NDSTable[110] =	0.747507533;
   NDSTable[111] =	0.768322499;
   NDSTable[112] =	0.788144666;
   NDSTable[113] =	0.806937708;
   NDSTable[114] =	0.824676076;
   NDSTable[115] =	0.84134474;
   NDSTable[116] =	0.856938778;
   NDSTable[117] =	0.871462801;
   NDSTable[118] =	0.884930268;
   NDSTable[119] =	0.897362682;
   NDSTable[120] =	0.908788718;
   NDSTable[121] =	0.919243289;
   NDSTable[122] =	0.928766586;
   NDSTable[123] =	0.937403109;
   NDSTable[124] =	0.945200711;
   NDSTable[125] =	0.95220967;
   NDSTable[126] =	0.95848182;
   NDSTable[127] =	0.964069734;
   NDSTable[128] =	0.969025988;
   NDSTable[129] =	0.973402495;
   NDSTable[130] =	0.977249938;
   NDSTable[131] =	0.980617279;
   NDSTable[132] =	0.983551363;
   NDSTable[133] =	0.986096601;
   NDSTable[134] =	0.988294738;
   NDSTable[135] =	0.990184693;
   NDSTable[136] =	0.991802471;
   NDSTable[137] =	0.99318113;
   NDSTable[138] =	0.994350806;
   NDSTable[139] =	0.995338778;
   NDSTable[140] =	0.996169575;
   NDSTable[141] =	0.996865104;
   NDSTable[142] =	0.997444809;
   NDSTable[143] =	0.997925836;
   NDSTable[144] =	0.998323214;
   NDSTable[145] =	0.998650033;
   NDSTable[146] =	0.998917631;
   NDSTable[147] =	0.999135768;
   NDSTable[148] =	0.999312798;
   NDSTable[149] =	0.999455831;
   NDSTable[150] =	0.999570883;
   NDSTable[151] =	0.999663019;
   NDSTable[152] =	0.999736476;
   NDSTable[153] =	0.999794781;
   NDSTable[154] =	0.999840854;
   NDSTable[155] =	0.999877101;
   NDSTable[156] =	0.999905491;
   NDSTable[157] =	0.999927628;
   NDSTable[158] =	0.999944813;
   NDSTable[159] =	0.999958094;
   NDSTable[160] =	0.999968314;
   
   return (100 * NDSTable[num]);
}